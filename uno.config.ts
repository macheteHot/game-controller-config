/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig, presetUno } from 'unocss'
import { presetScalpel } from 'unocss-preset-scalpel'

export default defineConfig({
  presets: [presetScalpel({}), presetUno()]
})
