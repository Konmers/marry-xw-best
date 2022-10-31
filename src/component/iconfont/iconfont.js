Component({
  properties: {
    // icon-xinniang2 | icon-xinlang2 | icon-daohang1 | icon-tubiaov-daochushangchuan- | icon-tubiaov-daochushangchuan-1 | icon-tubiaov-daochushangchuan-2 | icon-tubiaov-daochushangchuan-3 | icon-tubiaov-daochushangchuan-4 | icon-tubiaov-daochushangchuan-5 | icon-tubiaov-daochushangchuan-6 | icon-tubiaov-daochushangchuan-7 | icon-xiangkuang | icon-sheying | icon-wuxingjijiudian | icon-tianmiyike | icon-xinxinxiangdong | icon-ditu-copy | icon-biaodian_1-copy | icon-daohang3-copy | icon-daohang-xuanzhong-copy | icon-daohang-copy
    name: {
      type: String,
    },
    // string | string[]
    color: {
      type: null,
      observer: function(color) {
        this.setData({
          colors: this.fixColor(),
          isStr: typeof color === 'string',
        });
      }
    },
    size: {
      type: Number,
      value: 28,
      observer: function(size) {
        this.setData({
          svgSize: size,
        });
      },
    },
  },
  data: {
    colors: '',
    svgSize: 28,
    quot: '"',
    isStr: true,
  },
  methods: {
    fixColor: function() {
      var color = this.data.color;
      var hex2rgb = this.hex2rgb;

      if (typeof color === 'string') {
        return color.indexOf('#') === 0 ? hex2rgb(color) : color;
      }

      return color.map(function (item) {
        return item.indexOf('#') === 0 ? hex2rgb(item) : item;
      });
    },
    hex2rgb: function(hex) {
      var rgb = [];

      hex = hex.substr(1);

      if (hex.length === 3) {
        hex = hex.replace(/(.)/g, '$1$1');
      }

      hex.replace(/../g, function(color) {
        rgb.push(parseInt(color, 0x10));
        return color;
      });

      return 'rgb(' + rgb.join(',') + ')';
    }
  }
});
