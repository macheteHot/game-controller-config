<script setup lang="ts">
import '@/css/obs.css'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import DualSenseSvg from '@/assets/ps5DualSense.svg?component'
import { linearInterpolationColor, hexToRgba, mapValue } from '@/tools'

const touchTextRef = ref<HTMLDivElement>()

let controllerIndex = 0
let requestAnimationFrameId = -1
let leftJoyStick: SVGAElement
let leftJoyStickPoint: SVGAElement
let rightJoyStick: SVGAElement
let rightJoyStickPoint: SVGAElement
let touchPadTextStr = ''

function getCssVariable(str: string) {
  const rs = getComputedStyle(document.querySelector<HTMLElement>(':root')!)
  return rs.getPropertyValue(str).trim()
}

let moveThreshold: number
let joystickStartColor: string
let joystickEndColor: string
let joystickPointColor: string
let buttonStartColor: string

const buttonMap = {
  0: 'button_bottom',
  1: 'button_right',
  2: 'button_left',
  3: 'button_top',
  4: 'l1',
  5: 'r1',
  6: 'l2',
  7: 'r2',
  8: 'share',
  9: 'setting',
  10: 'l3_ring',
  11: 'r3_ring',
  12: 'dpad_top',
  13: 'dpad_bottom',
  14: 'dpad_left',
  15: 'dpad_right',
  16: 'ps',
  17: 'touch_pad'
}

function calcDom() {
  const touchPad = document.getElementById('touch_pad')
  if (!touchPad) return
  const { top, left, width, height } = touchPad.getBoundingClientRect()
  Object.assign(touchTextRef.value?.style ?? {}, {
    top: `${top + height * 0.05}px`,
    height: `${height * 0.9}px`,
    left: `${left}px`,
    width: `${width}px`
  })
}

function updateJoystickAndPoint(
  joystickStyle: CSSStyleDeclaration,
  joyStickPoint: CSSStyleDeclaration,
  originX: number,
  originY: number
) {
  const moveScale = 15
  const controllerMoveValue = Math.abs(originX) + Math.abs(originY)
  const mappedValue = mapValue(originY, -1, 1, 2, 1)
  const x = originX * mappedValue * moveScale
  const y = originY * mappedValue * moveScale
  // 摇杆
  Object.assign(joystickStyle, {
    fillOpacity: 1,
    fill:
      controllerMoveValue > moveThreshold
        ? linearInterpolationColor(
            joystickStartColor,
            joystickEndColor,
            Math.sqrt(originX * originX + originY * originY),
            0,
            1 //  虽然最远是斜向坐标 值是 根号2 1.41 但是我希望摇杆一个小圈就达到颜色最大值 那么 就是 系数的平方 * 2 此处直接写1
          )
        : 'transparent',
    transform:
      controllerMoveValue > moveThreshold ? `translate(${x}px, ${y}px)` : null
  })
  // 摇杆指向小球
  Object.assign(joyStickPoint, {
    fillOpacity: 1,
    fill:
      controllerMoveValue > moveThreshold ? joystickPointColor : 'transparent',
    transform:
      controllerMoveValue > moveThreshold ? `translate(${x}px, ${y}px)` : null
  })
}

function translateJoystick(axes: readonly number[]) {
  if (!leftJoyStick || !rightJoyStick) return
  const [lx, ly, rx, ry] = axes
  updateJoystickAndPoint(leftJoyStick.style, leftJoyStickPoint.style, lx, ly)
  updateJoystickAndPoint(rightJoyStick.style, rightJoyStickPoint.style, rx, ry)
}

function updateButton() {
  moveThreshold = Number(getCssVariable('--moveThreshold'))
  joystickStartColor = getCssVariable('--joystick-start-color')
  joystickEndColor = getCssVariable('--joystick-end-color')
  joystickPointColor = getCssVariable('--joystick-point')
  buttonStartColor = getCssVariable('--button-start-color')
  touchPadTextStr = getCssVariable('--touch-pad-text')
  const controller = navigator.getGamepads()[controllerIndex]
  if (!controller) {
    return
  }
  translateJoystick(controller.axes)

  controller.buttons.forEach((button, index) => {
    const btnID = buttonMap[index as keyof typeof buttonMap]
    if (btnID) {
      let btn = document.getElementById(btnID)
      if (btnID === 'ld') {
        btn = document.getElementById('l3_ring')
      }
      if (!btn) return

      if (btnID === 'touch_pad') {
        if (button.pressed) {
          touchTextRef.value!.children[0].textContent = touchPadTextStr
          touchTextRef.value!.classList.add('show_touch_pad_image')
        } else {
          touchTextRef.value!.children[0].textContent = ''
          touchTextRef.value!.classList.remove('show_touch_pad_image')
        }
      }
      if (!button.pressed) {
        btn.style.fill = 'transparent'
        return
      }
      if (['l2', 'r2'].includes(btnID)) {
        document.documentElement.style.setProperty(
          `--${btnID}-fill-color`,
          hexToRgba(buttonStartColor, button.value)
        )
        document
          .querySelectorAll(`.${btnID}_linearGradient_stop`)
          .forEach((gradientStop) => {
            gradientStop.setAttribute(
              'offset',
              `${Math.round(button.value * 100)}%`
            )
          })
        btn.style.fill = `url(#${btnID}_linearGradient)`
        return
      }
      btn.style.fill = `url(#button_fill_color)`
    }
  })
  requestAnimationFrameId = requestAnimationFrame(updateButton)
}

function gameControllerConnected({ gamepad }: GamepadEvent) {
  document.getElementById('disconnected')!.innerHTML = ''
  touchTextRef.value!.children[0].textContent = ''
  leftJoyStick = document.querySelector<SVGAElement>('#left_joystick')!
  leftJoyStickPoint = document.querySelector<SVGAElement>(
    '#left_joystick_point'
  )!
  rightJoyStick = document.querySelector<SVGAElement>('#right_joystick')!
  rightJoyStickPoint = document.querySelector<SVGAElement>(
    '#right_joystick_point'
  )!
  controllerIndex = gamepad.index
  updateButton()
}

function gameControllerDisconnect() {
  controllerIndex = 0
  document.getElementById('disconnected')!.innerHTML =
    '<tspan x="0" y="0">disconnected</tspan>'
  touchTextRef.value!.children[0].textContent = ''
  cancelAnimationFrame(requestAnimationFrameId)
}

onMounted(() => {
  calcDom()
  window.addEventListener('resize', calcDom)
  window.addEventListener('gamepadconnected', gameControllerConnected)
  window.addEventListener('gamepaddisconnected', gameControllerDisconnect)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', calcDom)
  window.removeEventListener('gamepadconnected', gameControllerConnected)
  window.removeEventListener('gamepaddisconnected', gameControllerDisconnect)
})
</script>

<template>
  <div class="w-100vw">
    <DualSenseSvg />
  </div>
  <div ref="touchTextRef" class="touch_text"><p></p></div>
</template>

<style></style>
