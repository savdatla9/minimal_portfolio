import { proxy } from 'valtio';

export const state = proxy({
  intro: false,
  title: 'shirt',
  colors: ['#ccc', '#efbd4e', '#80c670', '#726de8', '#ef674e', '#353934'],
  cupdecals: ['react', 'three', 'starbucks', 'mcdonalds', 'onepiece'],
  shirtdecals: ['react', 'three', 'onepiece'],
  color: '#efbd4e',
  shirtdecal: 'react',
  cupdecal: 'starbucks',
  laces: "#cccccc",
  mesh: "#ffffff",
  caps: "#ffffff",
  inner: "#ffffff",
  sole: "#ffffff",
  stripes: "#ffffff",
  band: "#ffffff",
  patch: "#ffffff",
  cap: "#cccccc",
  plastic: "#333333",
  cup: '#ffffff',
});