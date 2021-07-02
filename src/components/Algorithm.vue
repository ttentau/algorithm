<template>
  <div class='Algorithm'>
    <div class="container">
      <div class="top">
        <div class="time">
          <div class="start">开始时间：{{ startTime }}</div>
          <div class="end">结束时间：{{ endTime }}</div>
          <div class="spend">花费时间：{{ (endTime - startTime) / 1000 }} 秒</div>
        </div>
        <div class="config">
          <div class="input">
            <label for="amount">条数：</label>
            <input type="number" id="amount" v-model="columnAmount" @change="randomSort">
          </div>
          <div class="input">
            <label for="speed">速度：</label>
            <input type="number" id="speed" v-model="speed">
          </div>
        </div>
      </div>

      <ul>
        <li v-for="(item,index) of list" :key="index"
            :style="{height:50+(item.value*5)+'px',background: item.isChange? '#1afff9':item.color}">
          {{ item.value }}
        </li>
      </ul>

      <div class="toolbar">
        <button @click="randomSort()">Random</button>
        <button @click="startSort('Bubble')">Bubble</button>
        <button @click="startSort('Selection')">Selection</button>
        <button @click="startSort('Insertion')">Insertion</button>
        <button @click="startSort('Shell')">Shell</button>
        <button @click="startSort('Array')">Array</button>
        <button @click="test()">Test</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Algorithm",
  components: {},
  data() {
    return {
      list: [],
      columnAmount: 50,
      speed: 10,
      isRunSort: false,
      startTime: Date.now(),
      endTime: Date.now(),
      startColor: '#330867',
      endColor: '#30cbcd',
      // startColor: '#21f700',
      // endColor: '#ff0f00',
    }
  },
  watch: {
    columnAmount(newVal) {
      if (newVal > 100) {
        this.columnAmount = 100
      }
    }
  },
  async created() {
    this.randomSort(this.list)
  },
  computed: {},
  methods: {
    test() {
    },
    async startSort(type) {
      this.startTime = Date.now()
      this.endTime = Date.now()
      this.isRunSort = true
      let newArr = JSON.parse(JSON.stringify(this.list))
      switch (type) {
        case 'Bubble':
          await this.bubbleSort(newArr)
          break
        case 'Selection':
          await this.selectionSort(newArr)
          break
        case 'Insertion':
          await this.insertionSort(newArr)
          break
        case 'Shell':
          await this.shellSort(newArr)
          break
        case 'Array':
          await this.arraySort(newArr)
          break

      }
      this.endTime = Date.now()
      this.isRunSort = false
    },
    async updateView(list) {
      if (parseInt(this.speed) !== 0) {
        await this.sleep(this.speed)
      }
      // this.list = JSON.parse(JSON.stringify(list))
      this.list = list
    },
    //冒泡排序
    async bubbleSort(list) {
      for (let i = 0; i < list.length - 1; i++) {
        for (let j = 0; j < list.length - 1 - i; j++) {
          list.map(v => v.isChange = false)
          this.endTime = Date.now()
          if (!this.isRunSort) break
          if (list[j].value > list[j + 1].value) {
            let temp = list[j]
            list[j] = list[j + 1]
            list[j + 1] = temp
            list[j].isChange = true
            list[j + 1].isChange = true
            await this.updateView(list)
          }
        }
      }
      // console.log(list)
    },
    //希尔排序
    async shellSort(arr) {
      let len = arr.length
      for (let gap = Math.floor(len / 2); gap > 0; gap = Math.floor(gap / 2)) {
        // 注意：这里和动图演示的不一样，动图是分组执行，实际操作是多个分组交替执行
        for (let i = gap; i < len; i++) {
          let j = i
          let current = arr[i]
          while (j - gap >= 0 && current.value < arr[j - gap].value) {
            arr[j] = arr[j - gap]
            j = j - gap
          }
          arr[j] = current
          await this.updateView(arr)
        }
      }

    },
    //选择排序
    async selectionSort(list) {
      let len = list.length
      let minIndex, temp
      for (let i = 0; i < len - 1; i++) {
        this.endTime = Date.now()
        minIndex = i
        for (let j = i + 1; j < len; j++) {
          if (!this.isRunSort) break
          if (list[j].value < list[minIndex].value) {     // 寻找最小的数
            minIndex = j// 将最小数的索引保存
          }
        }
        temp = list[i]
        list[i] = list[minIndex]
        list[minIndex] = temp
        await this.updateView(list)

      }
    },

    //插入排序
    async insertionSort(arr) {
      let len = arr.length
      let preIndex, current
      for (let i = 1; i < len; i++) {
        preIndex = i - 1
        current = arr[i]
        while (preIndex >= 0 && arr[preIndex].value > current.value) {
          arr[preIndex + 1] = arr[preIndex]
          preIndex--
        }
        arr[preIndex + 1] = current
        await this.updateView(arr)
      }
    },
    //数组的原生排序
    async arraySort(list) {
      list.sort((a, b) => {
        return a.value - b.value
      })
      await this.updateView(list)
    },
    sleep(time) {
      return new Promise(resolve => {
        setTimeout(() => {
        }, time)
      })
    },
    randomSort() {
      if (this.isRunSort) return this.isRunSort = false
      let list = this.gradient(this.startColor, this.endColor, this.columnAmount)

      // let length = list.length
      // let newArr = []
      // let newIndexArr = []
      // for (let i = 0; i < length; i++) {
      //     let newIndex = this.getRandomInt(length)
      //     while (newIndexArr.indexOf(newIndex) !== -1) {
      //         newIndex = this.getRandomInt(length)
      //     }
      //     newIndexArr.push(newIndex)
      //     newArr.push(list[newIndex])
      // }
      // this.list = newArr
      list.sort(() => Math.random() - Math.random())
      this.list = list
    },
    getRandomInt(max) {
      return Math.floor(Math.random() * Math.floor(max))
    },
    rgbToHex(r, g, b) {
      let hex = ((r << 16) | (g << 8) | b).toString(16)
      return "#" + new Array(Math.abs(hex.length - 7)).join("0") + hex
    },
    hexToRgb(hex) {
      let rgb = []
      for (let i = 1; i < 7; i += 2) {
        rgb.push(parseInt("0x" + hex.slice(i, i + 2)))
      }
      return rgb
    },
    gradient(startColor, endColor, step) {
      //将hex转换为rgb
      let sColor = this.hexToRgb(startColor),
          eColor = this.hexToRgb(endColor)

      //计算R\G\B每一步的差值
      let rStep = (eColor[0] - sColor[0]) / step
      let gStep = (eColor[1] - sColor[1]) / step
      let bStep = (eColor[2] - sColor[2]) / step

      let gradientColorArr = []
      for (let i = 0; i < step; i++) {
        //计算每一步的hex值
        let temp = {
          color: this.rgbToHex(parseInt(rStep * i + sColor[0] + ""), parseInt(gStep * i + sColor[1] + ""), parseInt(bStep * i + sColor[2] + "")),
          value: i
        }
        gradientColorArr.push(temp)
      }
      return gradientColorArr
    }
  }
}
</script>

<style scoped lang='less'>
.Algorithm {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;

  .container {
    display: flex;
    flex-direction: column;
    background: #fff;
    border-radius: 4px;
    box-shadow: 4px 4px 20px #d1d1d1;
    padding: 20px;
    position: relative;

    .top {
      position: absolute;
      display: flex;
      justify-content: space-between;
      width: 98%;

      .time {
        display: flex;
        justify-content: center;

        div {
          margin: 0 10px;
          font-weight: bold;
          color: black;
          font-size: 20px;
        }
      }

      input {
        height: 25px;
        border-radius: 3px;
        background: #fff;
        border: 1px solid #c8cccf;
        color: #6a6f77;
        -web-kit-appearance: none;
        -moz-appearance: none;
        outline: 0;
      }

    }


    ul {
      margin-top: 50px;
      display: flex;
      align-items: flex-end;
      padding: 0;

      li {
        border-radius: 10px 10px 0 0;
        /*margin: 0 3px;*/
        width: 25px;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        padding-bottom: 10px;
        font-weight: bold;
        color: white;
        font-size: 20px;
        box-sizing: border-box;
      }
    }

    .config {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;

      .input {
        margin: 0 10px;
      }
    }

    .toolbar {
      margin-bottom: 20px;

      button {
        border-radius: 4px;
        padding: 10px 20px;
        color: white;
        border: 0;
        background: #007bff;
        margin: 0 10px;
      }

      button:hover {
        cursor: pointer;
        background: #2a98ff;
      }
    }
  }
}
</style>
