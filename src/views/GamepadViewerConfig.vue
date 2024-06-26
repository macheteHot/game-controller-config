<script setup lang="ts">
import PickColors from 'vue-pick-colors'
import { computed, reactive, ref, watchEffect } from 'vue'
import { Help } from '@icon-park/vue-next'
import wechatImg from '@/assets/images/wechat.jpg'
import customControllerImg from '@/assets/images/customController.png'
const previewIframe = ref<HTMLIFrameElement>()

const controllerUrl = new URL(location.href)
controllerUrl.pathname = '/obs'
controllerUrl.search = ''

const bgImageList = ref([])

const bgImageCurrentPage = ref(1)

const bgImageUrl = computed(
  () =>
    bgImageList.value[bgImageCurrentPage.value - 1] ??
    bgImageList.value[bgImageList.value.length - 1] ??
    ''
)

async function getImageList() {
  console.log(import.meta.env.MODE)
  const res = await fetch(
    import.meta.env.MODE === 'development'
      ? 'http://localhost:8787/getBingDayOfImageList'
      : 'https://api.gamepadobs.com/getBingDayOfImageList'
  )
  const data = await res.json()
  bgImageList.value = data
}

getImageList()

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

const touchPadImageSizePercent = reactive({
  name: '--touch-pad-image-size-percent',
  value: 100
})

watchEffect(() => {
  setStyleProperty(strokeColor.name, strokeColor.value)
  setStyleProperty(bgColor.name, bgColor.value)
  setStyleProperty(buttonStartColor.name, buttonStartColor.value)
  setStyleProperty(buttonEndColor.name, buttonEndColor.value)
  setStyleProperty(joystickStartColor.name, joystickStartColor.value)
  setStyleProperty(joystickEndColor.name, joystickEndColor.value)
  setStyleProperty(joystickPointColor.name, joystickPointColor.value)
  setStyleProperty(touchPadTextWeight.name, touchPadTextWeight.value)
  setStyleProperty(touchPadTextColor.name, touchPadTextColor.value)
  setStyleProperty(touchPadImageUrl.name, `url('${touchPadImageUrl.value}')`)
  setStyleProperty(touchPadDotOpacity.name, touchPadDotOpacity.value)
  setStyleProperty(touchPadText.name, touchPadText.value)
  setStyleProperty(touchPadTextSize.name, touchPadTextSize.value)
  setStyleProperty(touchPadOffsetX.name, touchPadOffsetX.value)
  setStyleProperty(touchPadOffsetY.name, touchPadOffsetY.value)
  setStyleProperty(touchPadImgOpacity.name, touchPadImgOpacity.value)
  setStyleProperty(
    touchPadImageSizePercent.name,
    touchPadImageSizePercent.value
  )
  setStyleProperty(touchPadImageOffsetX.name, touchPadImageOffsetX.value)
  setStyleProperty(touchPadImageOffsetY.name, touchPadImageOffsetY.value)
})

function setStyleProperty(property: string, value: string | number) {
  const doc = previewIframe.value?.contentDocument
  doc?.documentElement.style.setProperty(property, `${value}`)
}

const loadingUpdate = ref(false)
function readerAsDataUrl(file: File): Promise<string> {
  const reader = new FileReader()
  return new Promise((resolve, reject) => {
    reader.readAsDataURL(file)
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('解析错误'))
      }
    }
    reader.onerror = reject
  })
}

async function uploadImage() {
  loadingUpdate.value = true
  try {
    const [fileHandle] = await window.showOpenFilePicker({
      types: [
        {
          description: 'Images',
          accept: {
            'image/*': ['.png', '.gif', '.jpeg', '.jpg']
          }
        }
      ],
      excludeAcceptAllOption: true,
      multiple: false
    })
    const imageFile = await fileHandle.getFile()
    if (imageFile.size > 1 * 1024 * 1024) {
      // max size 1m
      ElMessage.error('图片应小于1Mb 或使用网络地址')
      return
    }
    const dataUrl = await readerAsDataUrl(imageFile)
    touchPadImageUrl.value = dataUrl
  } catch (error) {
    if (error instanceof DOMException) {
      // 用户取消了操作
      return
    }
    console.error(error)
    ElMessage.error('图片处理失败')
  } finally {
    loadingUpdate.value = false
  }
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
  str += `  ${touchPadImageSizePercent.name}: ${touchPadImageSizePercent.value};\n`
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
    class="w-100vw h-100vh overflow-hidden"
    :style="{
      background: showPreviewBg ? `url(${bgImageUrl})` : previewBgColor,
      'background-size': 'cover',
      'background-position': 'center center',
      'background-repeat': 'no-repeat'
    }"
  >
    <el-col :span="10" class="h-100vh overflow-auto">
      <el-form class="m-10" label-width="160px">
        <div class="d-flex flex-direction-column gap-16">
          <el-card>
            <template #header>
              <div class="flex-between-center">
                <h3 class="fs-20">手柄配置</h3>
                <p class="c-red fs-24 fw-bolder">
                  只支持 chrome 请连接上手柄进行调试
                </p>
              </div>
            </template>
            <el-row>
              <el-col :span="12">
                <el-form-item label="线框颜色">
                  <pick-colors
                    v-model:value="strokeColor.value"
                    class="cursor-pointer"
                    :size="30"
                    show-alpha
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="手柄背景色">
                  <pick-colors
                    v-model:value="bgColor.value"
                    class="cursor-pointer"
                    :size="30"
                    show-alpha
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
                  <pick-colors
                    v-model:value="buttonStartColor.value"
                    class="cursor-pointer"
                    :size="30"
                    show-alpha
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="按钮渐变结束">
                  <pick-colors
                    v-model:value="buttonEndColor.value"
                    class="cursor-pointer"
                    :size="30"
                    show-alpha
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="摇杆渐变开始">
                  <pick-colors
                    v-model:value="joystickStartColor.value"
                    class="cursor-pointer"
                    :size="30"
                    show-alpha
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="摇杆渐变结束">
                  <pick-colors
                    v-model:value="joystickEndColor.value"
                    class="cursor-pointer"
                    :size="30"
                    show-alpha
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="摇杆上指向球">
                  <pick-colors
                    v-model:value="joystickPointColor.value"
                    class="cursor-pointer"
                    :size="30"
                    show-alpha
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
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="文字">
                  <el-input v-model="touchPadText.value" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="触摸板字重">
                  <el-select v-model="touchPadTextWeight.value">
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
                  <pick-colors
                    v-model:value="touchPadTextColor.value"
                    class="cursor-pointer"
                    :size="30"
                    color-format="hex"
                    show-alpha
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="文字大小">
                  <el-slider
                    v-model="touchPadTextSize.value"
                    :step="0.01"
                    :min="0"
                    :max="15"
                    show-input
                    :precision="2"
                    class="w-100p!"
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
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item v-loading="loadingUpdate" label="图片url">
                  <div class="flex-flex-start-center w-100p">
                    <el-input
                      v-model="touchPadImageUrl.value"
                      class="m-r-30 w-auto! flex-1"
                      clearable
                    />
                    <el-button
                      class="el-input-number"
                      type="primary"
                      @click="uploadImage"
                      >上传</el-button
                    >
                  </div>
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
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="图片大小百分比">
                  <el-slider
                    v-model="touchPadImageSizePercent.value"
                    show-input
                    :step="0.1"
                    :min="0"
                    :max="300"
                    :precision="2"
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
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>
          <el-card>
            <template #header>
              <h3 class="fs-20">结果</h3>
            </template>
            <div class="flex-flex-start-center m-l-120">
              <span>建议obs 宽度</span>
              <span class="c-red m-x-4 fw-bolder">1920</span>
              <span>高度</span>
              <span class="c-red m-x-4 fw-bolder">2000</span>
              <span>提高采样率后再调整大小</span>
            </div>
            <div class="flex-flex-start-center h-40 m-l-120">
              <span>控制器地址:</span>
              <span class="c-red fw-bolder m-l-8">{{
                controllerUrl.toString()
              }}</span>
              <el-button class="m-l-auto" type="primary" @click="copyUrl">
                复制
              </el-button>
            </div>
            <el-form-item label="CSS">
              <div class="flex-space-between-end w-100p lh-20 c-#5c5656">
                <div
                  style="white-space: pre-line"
                  class="border-1 border-solid border-#AAA br-8 p-10 w-400 h-200 overflow-y-scroll"
                >
                  {{ cssResult }}
                </div>
                <el-button type="primary" @click="copyCssResult">
                  复制
                </el-button>
              </div>
            </el-form-item>
          </el-card>
          <el-card>
            <template #header>
              <h3 class="fs-20">赞助 Donate</h3>
            </template>
            <div class="flex-flex-start-center">
              <div class="flex-direction-column flex-flex-start-center">
                <p class="m-b-8">如果你喜欢我的作品 可以请我喝一杯咖啡☕️</p>
                <img :src="wechatImg" class="w-200" />
              </div>
              <div
                class="m-l-8 flex-flex-start-center flex-direction-column gap-8"
              >
                <p>更多定制化需求 欢迎联系</p>
                <a
                  href="mailto:gasser_heralds_0a@icloud.com?subject=定制手柄需求"
                  type="email"
                  >gasser_heralds_0a@icloud.com</a
                >
                <img :src="customControllerImg" class="w-400" />
              </div>
            </div>
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
        <el-pagination
          v-show="showPreviewBg"
          v-model:current-page="bgImageCurrentPage"
          small
          background
          :page-size="1"
          layout="pager"
          :pager-count="11"
          :total="bgImageList.length"
        />
        <div v-show="!showPreviewBg" class="flex-flex-start-center gap-24">
          <p class="c-#FFF fw-bolder fs-18 text-align-right select-none">
            背景色
          </p>
          <pick-colors
            v-model:value="previewBgColor"
            class="cursor-pointer"
            :size="30"
            show-alpha
            color-format="hex"
          />
        </div>
      </div>
      <div
        class="pos-fixed h-100vh flex-center-center"
        style="width: calc(calc(14 / 24) * 100%)"
      >
        <iframe
          ref="previewIframe"
          style="aspect-ratio: 7 / 4.1"
          class="w-90p overflow-hidden"
          src="/obs"
        ></iframe>
      </div>
    </el-col>
  </el-row>
</template>

<style scoped>
* {
  user-select: none;
}
/**  */
</style>
