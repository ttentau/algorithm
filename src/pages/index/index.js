// import './article.html' //导入html，不然不会热更新
require('html-loader!./index.html')//导入html，不然不会热更新。注释掉上面的语法是因为，去掉了webpack.config.js里面的html-loader的配置。
// 只能用require了
import './index.less'

let list = []
let columnAmount = 50
let speed = 10
let startTime = Date.now()
let endTime = Date.now()
let startColor = '#330867'
let endColor = '#30cbcd'

function getEl(val) {
  return document.querySelector(val)
}

function rgbToHex(r, g, b) {
  let hex = ((r << 16) | (g << 8) | b).toString(16)
  return "#" + new Array(Math.abs(hex.length - 7)).join("0") + hex
}

function hexToRgb(hex) {
  let rgb = []
  for (let i = 1; i < 7; i += 2) {
    rgb.push(parseInt("0x" + hex.slice(i, i + 2)))
  }
  return rgb
}

function gradient(startColor, endColor, step) {
  //将hex转换为rgb
  let sColor = hexToRgb(startColor),
    eColor = hexToRgb(endColor)

  //计算R\G\B每一步的差值
  let rStep = (eColor[0] - sColor[0]) / step
  let gStep = (eColor[1] - sColor[1]) / step
  let bStep = (eColor[2] - sColor[2]) / step

  let gradientColorArr = []
  for (let i = 0; i < step; i++) {
    //计算每一步的hex值
    let temp = {
      color: rgbToHex(parseInt(rStep * i + sColor[0] + ""), parseInt(gStep * i + sColor[1] + ""), parseInt(bStep * i + sColor[2] + "")),
      value: i
    }
    gradientColorArr.push(temp)
  }
  return gradientColorArr
}

function $console(val) {
  console.log(JSON.stringify(val), null, 4)
}

async function startSort(type) {
  startTime = Date.now()
  getEl('.start').innerHTML = '开始时间：' + endTime
  endTime = Date.now()
  getEl('.end').innerHTML = '结束时间：' + endTime
  switch (type) {
    case 'bubble':
      await bubbleSort(list)
      break
    case 'selection':
      await selectionSort(list)
      break
    case 'insertion':
      await insertionSort(list)
      break
    case 'shell':
      await shellSort(list)
      break
    // case 'Array':
    //   await this.arraySort(newArr)
    //   break
  }
  endTime = Date.now()
  getEl('.end').innerHTML = '结束时间：' + endTime
  // this.isRunSort = false
}

let ul = getEl('ul')
getEl('#random').addEventListener('click', () => {
  list = list.sort(() => Math.random() - Math.random())
  list.map(v => v.isChange = false)
  updateView(list)
})
getEl('#bubble').addEventListener('click', () => {
  startSort('bubble')
})
getEl('#selection').addEventListener('click', () => {
  startSort('selection')
})
getEl('#insertion').addEventListener('click', async () => {
  await startSort('insertion')
})
getEl('#shell').addEventListener('click', async () => {
  await startSort('shell')
})
getEl('#amount').addEventListener('input', e => {
  columnAmount = e.target.value
  init()
})
getEl('#speed').addEventListener('input', e => {
  speed = e.target.value
})

init()

function init() {
  list = gradient(startColor, endColor, columnAmount)
  list = list.sort(() => Math.random() - Math.random())
  updateView(list)
}

function create(tagName) {
  return document.createElement(tagName)
}

async function updateView(list) {
  await sleep(speed)
  ul.innerHTML = "";
  list.map((v, i) => {
    let node = document.createElement('li')
    node.style.height = 50 + (v.value * 5) + 'px'
    node.style.background = v.isChange ? 'red' : v.color
    let text = document.createTextNode(v.value)
    node.appendChild(text)
    ul.appendChild(node)
  })
}

function sleep(time) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

//冒泡排序
async function bubbleSort(list) {
  for (let i = 0; i < list.length - 1; i++) {
    for (let j = 0; j < list.length - 1 - i; j++) {
      list.map(v => v.isChange = false)
      endTime = Date.now()
      getEl('.end').innerHTML = '结束时间：' + endTime
      getEl('.spend').innerHTML = '花费时间：' + (endTime - startTime) / 1000 + '秒'
      // if (!this.isRunSort) break
      if (list[j].value > list[j + 1].value) {
        let temp = list[j]
        list[j] = list[j + 1]
        list[j + 1] = temp
        list[j].isChange = true
        list[j + 1].isChange = true
        await updateView(list)
      }
    }
  }
}

//选择排序
async function selectionSort(list) {
  let len = list.length
  let minIndex, temp
  for (let i = 0; i < len - 1; i++) {
    endTime = Date.now()
    getEl('.end').innerHTML = '结束时间：' + endTime
    getEl('.spend').innerHTML = '花费时间：' + (endTime - startTime) / 1000 + '秒'
    minIndex = i
    for (let j = i + 1; j < len; j++) {
      list.map(v => v.isChange = false)
      // if (!this.isRunSort) break
      if (list[j].value < list[minIndex].value) {     // 寻找最小的数
        list[j].isChange = true
        list[minIndex].isChange = true
        minIndex = j// 将最小数的索引保存
        await updateView(list)
      }
    }
    temp = list[i]
    list[i] = list[minIndex]
    list[minIndex] = temp
    await updateView(list)
  }
}

//插入排序
async function insertionSort(arr) {
  let len = arr.length
  let preIndex, current
  for (let i = 1; i < len; i++) {
    endTime = Date.now()
    getEl('.end').innerHTML = '结束时间：' + endTime
    getEl('.spend').innerHTML = '花费时间：' + (endTime - startTime) / 1000 + '秒'
    arr.map(v => v.isChange = false)
    preIndex = i - 1
    current = arr[i]
    while (preIndex >= 0 && arr[preIndex].value > current.value) {
      arr[preIndex + 1] = arr[preIndex]
      arr[preIndex + 1].isChange = true
      await updateView(arr)
      preIndex--
    }
    arr[preIndex + 1] = current
    // arr[preIndex + 1].isChange = true
    await updateView(arr)
  }
}

//希尔排序
async function shellSort(arr) {
  let len = arr.length
  for (let gap = Math.floor(len / 2); gap > 0; gap = Math.floor(gap / 2)) {
    endTime = Date.now()
    getEl('.end').innerHTML = '结束时间：' + endTime
    getEl('.spend').innerHTML = '花费时间：' + (endTime - startTime) / 1000 + '秒'
    // 注意：这里和动图演示的不一样，动图是分组执行，实际操作是多个分组交替执行
    for (let i = gap; i < len; i++) {
      let j = i
      let current = arr[i]
      while (j - gap >= 0 && current.value < arr[j - gap].value) {
        arr[j] = arr[j - gap]
        j = j - gap
      }
      arr[j] = current
      await updateView(arr)
    }
  }
}