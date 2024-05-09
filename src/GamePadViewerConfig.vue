<script setup lang="ts">
import bgImg from './assets/images/bg.jpg'
import { computed, reactive, ref } from 'vue'
import { Help } from '@icon-park/vue-next'

const previewIframe = ref<HTMLIFrameElement>()

const iframeSrc =
  import.meta.env.MODE === 'development'
    ? 'dualsenseView.html'
    : '../dualsenseView.html'

const controllerUrl = new URL(location.href)
controllerUrl.pathname = iframeSrc
controllerUrl.search = ''

const showPreviewBg = ref(true)
const previewBgColor = ref('#FFF')

const strokeColor = reactive({
  name: '--stroke-color',
  value: '#AAA'
})

const bgColor = reactive({
  name: '--bg-color',
  value: '#0000004d'
})

const buttonStartColor = reactive({
  name: '--button-start-color',
  value: '#c3c300'
})

const buttonEndColor = reactive({
  name: '--button-end-color',
  value: '#e3e3e3'
})

const joystickStartColor = reactive({
  name: '--joystick-start-color',
  value: '#c3c300'
})

const joystickEndColor = reactive({
  name: '--joystick-end-color',
  value: '#591B13'
})

const joystickPointColor = reactive({
  name: '--joystick-point',
  value: '#FFFFFF'
})

const moveThreshold = reactive({
  name: '--moveThreshold',
  value: 0.09
})

const touchPadDotOpacity = reactive({
  name: '--touch_pad_dot_opacity',
  value: 0.2
})

const touchPadText = reactive({
  name: '--touch-pad-text',
  value: '你干嘛, ~~哎哟'
})

const touchPadTextWeight = reactive({
  name: '--touch-pad-text-weight',
  value: 800
})

const touchPadTextColor = reactive({
  name: '--touch-pad-text-color',
  value: '#E84118'
})

const touchPadTextSize = reactive({
  name: '--touch-pad-text-size',
  value: 4
})

const touchPadOffsetX = reactive({
  name: '--touch-pad-offset-x',
  value: 0
})

const touchPadOffsetY = reactive({
  name: '--touch-pad-offset-y',
  value: 0
})

const touchPadImageUrl = reactive({
  name: '--touch-pad-image-url',
  value: ''
})

const touchPadImgOpacity = reactive({
  name: '--touch-pad-image-opacity',
  value: 1
})

const touchPadImageOffsetX = reactive({
  name: '--touch-pad-image-offset-x',
  value: 0
})

const touchPadImageOffsetY = reactive({
  name: '--touch-pad-image-offset-y',
  value: 0
})

const touchPadImageHeightPercent = reactive({
  name: '--touch-pad-image-height-percent',
  value: 100
})

function setStyleProperty(property: string, value: string | number) {
  console.log(property, value)
  const doc = previewIframe.value?.contentDocument
  doc?.documentElement.style.setProperty(property, `${value}`)
}

const cssResult = computed(() => {
  let str = 'body{ background-color: rgba(0,0,0,0);}\n'
  str += ':root { \n'
  str += `  ${strokeColor.name}: ${strokeColor.value};\n`
  str += `  ${bgColor.name}: ${bgColor.value};\n`
  str += `  ${buttonStartColor.name}: ${buttonStartColor.value};\n`
  str += `  ${buttonEndColor.name}: ${buttonEndColor.value};\n`
  str += `  ${joystickStartColor.name}: ${joystickStartColor.value};\n`
  str += `  ${joystickEndColor.name}: ${joystickEndColor.value};\n`
  str += `  ${joystickPointColor.name}: ${joystickPointColor.value};\n`
  str += `  ${moveThreshold.name}: ${moveThreshold.value};\n`
  str += `  ${touchPadDotOpacity.name}: ${touchPadDotOpacity.value};\n`
  str += `  ${touchPadText.name}: ${touchPadText.value};\n`
  str += `  ${touchPadTextWeight.name}: ${touchPadTextWeight.value};\n`
  str += `  ${touchPadTextColor.name}: ${touchPadTextColor.value};\n`
  str += `  ${touchPadTextSize.name}: ${touchPadTextSize.value};\n`
  str += `  ${touchPadOffsetX.name}: ${touchPadOffsetX.value};\n`
  str += `  ${touchPadOffsetY.name}: ${touchPadOffsetY.value};\n`
  str += `  ${touchPadImageUrl.name}: url('${touchPadImageUrl.value}');\n`
  str += `  ${touchPadImgOpacity.name}: ${touchPadImgOpacity.value};\n`
  str += `  ${touchPadImageOffsetX.name}: ${touchPadImageOffsetX.value};\n`
  str += `  ${touchPadImageOffsetY.name}: ${touchPadImageOffsetY.value};\n`
  str += `  ${touchPadImageHeightPercent.name}: ${touchPadImageHeightPercent.value};\n`
  str += `}`
  return str
})

function copyCssResult() {
  navigator.clipboard.writeText(cssResult.value)
}

function copyUrl() {
  navigator.clipboard.writeText(controllerUrl.toString())
}
</script>

<template>
  <el-row
    :style="{ background: showPreviewBg ? `url(${bgImg})` : previewBgColor }"
  >
    <el-col :span="10">
      <el-form class="m-10" label-width="160px">
        <div class="d-flex flex-direction-column gap-16">
          <el-card>
            <template #header>
              <h3 class="fs-20">手柄配置</h3>
            </template>
            <el-row>
              <el-col :span="12">
                <el-form-item label="线框颜色">
                  <el-color-picker
                    v-model="strokeColor.value"
                    show-alpha
                    size="large"
                    @change="
                      setStyleProperty(strokeColor.name, strokeColor.value)
                    "
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="手柄背景色">
                  <el-color-picker
                    v-model="bgColor.value"
                    show-alpha
                    size="large"
                    color-format="hex"
                    @change="setStyleProperty(bgColor.name, bgColor.value)"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item>
                  <template #label>
                    <p>静默偏移量</p>
                    <el-tooltip
                      class="box-item"
                      effect="dark"
                      content="调整摇杆检测灵敏度 当你轻触摇杆才亮是最合适的"
                      placement="top"
                    >
                      <help
                        theme="outline"
                        size="18"
                        class="p-t-4 m-l-4"
                        fill="#333"
                      />
                    </el-tooltip>
                  </template>
                  <el-slider
                    v-model="moveThreshold.value"
                    show-input
                    :min="0"
                    :max="1"
                    :step="0.01"
                    :precision="2"
                    @input="
                      setStyleProperty(moveThreshold.name, moveThreshold.value)
                    "
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>
          <el-card>
            <template #header>
              <h3 class="fs-20">按钮配置</h3>
            </template>
            <el-row>
              <el-col :span="12">
                <el-form-item label="按钮渐变开始">
                  <el-color-picker
                    v-model="buttonStartColor.value"
                    show-alpha
                    color-format="hex"
                    size="large"
                    @change="
                      setStyleProperty(
                        buttonStartColor.name,
                        buttonStartColor.value
                      )
                    "
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="按钮渐变结束">
                  <el-color-picker
                    v-model="buttonEndColor.value"
                    show-alpha
                    color-format="hex"
                    size="large"
                    @change="
                      setStyleProperty(
                        buttonEndColor.name,
                        buttonEndColor.value
                      )
                    "
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="摇杆渐变开始">
                  <el-color-picker
                    v-model="joystickStartColor.value"
                    show-alpha
                    color-format="hex"
                    size="large"
                    @change="
                      setStyleProperty(
                        joystickStartColor.name,
                        joystickStartColor.value
                      )
                    "
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="摇杆渐变结束">
                  <el-color-picker
                    v-model="joystickEndColor.value"
                    color-format="hex"
                    show-alpha
                    size="large"
                    @change="
                      setStyleProperty(
                        joystickEndColor.name,
                        joystickEndColor.value
                      )
                    "
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="摇杆上指向球">
                  <el-color-picker
                    v-model="joystickPointColor.value"
                    color-format="hex"
                    show-alpha
                    size="large"
                    @change="
                      setStyleProperty(
                        joystickPointColor.name,
                        joystickPointColor.value
                      )
                    "
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>
          <el-card>
            <template #header>
              <h3 class="fs-20">触摸板</h3>
            </template>
            <el-row>
              <el-col :span="24">
                <el-form-item label="装饰点透明度">
                  <el-slider
                    v-model="touchPadDotOpacity.value"
                    :min="0"
                    :max="1"
                    :step="0.001"
                    :precision="2"
                    show-input
                    @input="
                      setStyleProperty(
                        touchPadDotOpacity.name,
                        touchPadDotOpacity.value
                      )
                    "
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="文字">
                  <el-input
                    v-model="touchPadText.value"
                    size="large"
                    @input="
                      setStyleProperty(touchPadText.name, touchPadText.value)
                    "
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="触摸板字重">
                  <el-select
                    v-model="touchPadTextWeight.value"
                    @change="
                      setStyleProperty(
                        touchPadTextWeight.name,
                        touchPadTextWeight.value
                      )
                    "
                  >
                    <el-option
                      v-for="item in [
                        100, 200, 300, 400, 500, 600, 700, 800, 900
                      ]"
                      :key="item"
                      :label="item"
                      :value="item"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="文字颜色">
                  <el-color-picker
                    v-model="touchPadTextColor.value"
                    color-format="hex"
                    show-alpha
                    size="large"
                    @change="
                      setStyleProperty(
                        touchPadTextColor.name,
                        touchPadTextColor.value
                      )
                    "
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="文字大小">
                  <el-input-number
                    v-model="touchPadTextSize.value"
                    @change="
                      setStyleProperty(
                        touchPadTextSize.name,
                        touchPadTextSize.value
                      )
                    "
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="文字偏移位置 x">
                  <el-slider
                    v-model="touchPadOffsetX.value"
                    show-input
                    :step="0.1"
                    :min="-50"
                    :max="50"
                    :precision="2"
                    @input="
                      setStyleProperty(
                        touchPadOffsetX.name,
                        touchPadOffsetX.value
                      )
                    "
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="文字偏移位置 y">
                  <el-slider
                    v-model="touchPadOffsetY.value"
                    show-input
                    :step="0.1"
                    :min="-50"
                    :max="50"
                    :precision="2"
                    @input="
                      setStyleProperty(
                        touchPadOffsetY.name,
                        touchPadOffsetY.value
                      )
                    "
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="图片url">
                  <el-input
                    v-model="touchPadImageUrl.value"
                    show-input
                    @change="
                      setStyleProperty(
                        touchPadImageUrl.name,
                        `url('${touchPadImageUrl.value}')`
                      )
                    "
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="图片透明度">
                  <el-slider
                    v-model="touchPadImgOpacity.value"
                    show-input
                    :step="0.01"
                    :min="0"
                    :max="1"
                    :precision="2"
                    @input="
                      setStyleProperty(
                        touchPadImgOpacity.name,
                        touchPadImgOpacity.value
                      )
                    "
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="图片大小百分比">
                  <el-slider
                    v-model="touchPadImageHeightPercent.value"
                    show-input
                    :step="0.1"
                    :min="0"
                    :max="300"
                    :precision="2"
                    @input="
                      setStyleProperty(
                        touchPadImageHeightPercent.name,
                        touchPadImageHeightPercent.value
                      )
                    "
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="图片偏移位置 x">
                  <el-slider
                    v-model="touchPadImageOffsetX.value"
                    :min="-50"
                    :max="50"
                    :step="0.01"
                    :precision="2"
                    show-input
                    @input="
                      setStyleProperty(
                        touchPadImageOffsetX.name,
                        touchPadImageOffsetX.value
                      )
                    "
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="图片偏移位置 y">
                  <el-slider
                    v-model="touchPadImageOffsetY.value"
                    show-input
                    :min="-50"
                    :max="50"
                    :step="0.01"
                    :precision="2"
                    @input="
                      setStyleProperty(
                        touchPadImageOffsetY.name,
                        touchPadImageOffsetY.value
                      )
                    "
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>
          <el-card>
            <template #header>
              <h3 class="fs-20">结果</h3>
            </template>
            <div class="flex-center-center h-40 m-l-120">
              <p>
                控制器地址:<span class="m-l-20">{{
                  controllerUrl.toString()
                }}</span>
              </p>
              <el-button class="m-l-auto" type="primary" @click="copyUrl">
                复制
              </el-button>
            </div>
            <el-form-item label="CSS">
              <el-input
                v-model:model-value="cssResult"
                readonly
                type="textarea"
                rows="10"
              />
              <el-button
                class="m-t-10 m-l-auto"
                type="primary"
                @click="copyCssResult"
              >
                复制
              </el-button>
            </el-form-item>
          </el-card>
        </div>
      </el-form>
    </el-col>
    <el-col :span="14">
      <div
        class="pos-fixed z-3 bg-#0000004d t-12 br-8 p-8 d-flex flex-column gap-8"
      >
        <div class="flex-flex-start-center gap-24">
          <p class="c-#FFF fw-bolder fs-18 text-align-right select-none">
            背景图
          </p>
          <el-switch v-model="showPreviewBg" />
        </div>
        <div v-show="!showPreviewBg" class="flex-flex-start-center gap-24">
          <p class="c-#FFF fw-bolder fs-18 text-align-right select-none">
            背景色
          </p>
          <el-color-picker
            v-model="previewBgColor"
            show-alpha
            size="large"
            color-format="hex"
          />
        </div>
      </div>
      <div class="pos-fixed h-100vh" style="width: calc(calc(14 / 24) * 100%)">
        <iframe
          ref="previewIframe"
          class="square-100p"
          :src="iframeSrc"
        ></iframe>
      </div>
    </el-col>
  </el-row>
</template>

<style scoped>
/**  */
</style>
