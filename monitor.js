/* 智慧能源平台 Demo — 能源实时监测页
   支持3种层级场景：完整三级 / 无站点有设备 / 直挂回路 */

const X_LABELS = (() => {
  const out = [];
  for (let m = 16 * 60 + 30; m <= 18 * 60 + 50; m += 5) {
    out.push(`${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`);
  }
  return out;
})();

function d5(vals) {
  const out = [];
  vals.forEach((v, i) => {
    out.push(v);
    if (i < vals.length - 1) out.push(+((v + vals[i + 1]) / 2).toFixed(2));
  });
  return out;
}

const PIE = { jian: '#FF8A3D', feng: '#2BA245', ping: '#3E9BE0', gu: '#FFC53D', shen: '#9270CA' };
const REGION = ['#3E9BE0', '#2BA245', '#FFC53D', '#9270CA'];

/* ==================== TYPES（页面级数据，不变） ==================== */
const TYPES = {
  power: {
    tab: '电力监测',
    c1: {
      title: '变电站监控',
      stats: [['安全运行', '1598', '天'], ['用电评分', '89.20', '分'], ['变压器数量', '1', '个'], ['监测点数量', '12', '个']],
      loadTitle: '负载监控',
      loads: [['实时负荷', '57.83', 'kW'], ['实时负荷率', '9.18', '%'], ['今日最大负荷', '123', 'kW'], ['今日最小负荷', '0', 'kW']],
      chartTitle: '实时负荷',
      chart: { unit: 'kVA', yMax: 100, x: X_LABELS, series: [
        { name: '车间总负荷', color: '#3E9BE0', data: d5([38, 38, 37, 2, 1, 2, 1, 2, 52, 51, 50, 24, 23, 22, 22]) },
        { name: '低压主受', color: '#FF8A3D', data: d5([92, 52, 54, 53, 32, 31, 31, 38, 35, 33, 36, 34, 33, 38, 34]) },
      ]},
    },
    c2: {
      title: '电量监控', word: '电量', unit: 'kWh', today: 1044.1, yest: 978.6, ratio: 6.7,
      blocks: [
        { kind: 'donut', title: '尖峰平谷占比', slices: [['尖', 0, PIE.jian], ['峰', 123, PIE.feng], ['平', 112, PIE.ping], ['谷', 10, PIE.gu], ['深谷', 0, PIE.shen]] },
        { kind: 'donut', title: '变压器电量占比', slices: [['1#变压器', 100, '#FF8A3D']] },
        { kind: 'hbar', title: '今日用电top5', unit: 'kWh', max: 150, items: [['大、小烤炉', 108], ['大烤炉', 82], ['刷毛车间', 12], ['1号厂房动力电', 3], ['1号厂房照明', 2]] },
      ],
    },
    c3: { title: '变压器监控', cols: '200px 200px minmax(0,1fr)' },
    alarms: [['告警支路', 4], ['未解除告警', 1], ['离线设备', 2]],
    alarmList: [
      ['功率因数异常告警', '2026-09-29 09:12:30', 0], ['越限报警', '2026-09-28 16:38:00', 1],
      ['电压异常告警', '2026-09-27 11:05:42', 1], ['过载告警', '2026-09-26 21:22:11', 1],
      ['三相不平衡告警', '2026-09-25 15:41:07', 1], ['变压器温度告警', '2026-09-24 08:19:33', 1],
      ['漏电告警', '2026-09-22 19:56:48', 1], ['越限报警', '2026-09-21 13:27:15', 1],
      ['功率因数异常告警', '2026-09-20 07:44:52', 1], ['过载告警', '2026-09-19 22:10:36', 1],
    ],
  },
  water: {
    tab: '水耗监测',
    c1: {
      title: '水泵房监控',
      stats: [['安全运行', '1286', '天'], ['用水评分', '92.00', '分'], ['水泵数量', '2', '个'], ['监测点数量', '12', '个']],
      loadTitle: '水压监控',
      loads: [['实时水压', '0.42', 'MPa'], ['水压负载率', '68.50', '%'], ['今日最大水压', '0.51', 'MPa'], ['今日最小水压', '0.36', 'MPa']],
      chartTitle: '实时水压',
      chart: { unit: 'MPa', yMax: 0.6, x: X_LABELS, series: [
        { name: '出水总管', color: '#3E9BE0', data: d5([0.42, 0.43, 0.41, 0.44, 0.45, 0.44, 0.42, 0.40, 0.41, 0.43, 0.44, 0.42, 0.41, 0.42, 0.42]) },
        { name: '1#泵出口', color: '#FF8A3D', data: d5([0.36, 0.35, 0.37, 0.36, 0.38, 0.37, 0.36, 0.35, 0.36, 0.37, 0.36, 0.35, 0.36, 0.36, 0.36]) },
      ]},
    },
    c2: {
      title: '水量监控', word: '水量', unit: 'm³', today: 386.5, yest: 352.5, ratio: 9.6,
      blocks: [
        { kind: 'donut', title: '各区域水量占比', slices: [['生产区', 186, REGION[0]], ['办公区', 92, REGION[1]], ['宿舍区', 68, REGION[2]], ['绿化', 40.5, REGION[3]]] },
        { kind: 'hbar', title: '今日用水top5', unit: 'm³', max: 150, items: [['生产一车间', 128], ['生产二车间', 96], ['冷却循环', 74], ['办公区', 52], ['宿舍区', 34]] },
      ],
    },
    c3: { title: '水表监控', cols: '200px minmax(0,1fr)' },
    alarms: [['告警支路', 2], ['未解除告警', 1], ['离线设备', 1]],
    alarmList: [
      ['漏水告警', '2026-09-29 08:40:12', 0], ['水压异常告警', '2026-09-28 14:22:31', 1],
      ['流量异常告警', '2026-09-27 09:15:08', 1], ['水泵故障告警', '2026-09-25 18:47:55', 1],
      ['水质异常告警', '2026-09-24 16:08:25', 1], ['流量异常告警', '2026-09-23 10:52:14', 1],
      ['水压异常告警', '2026-09-22 07:36:49', 1], ['水泵故障告警', '2026-09-20 21:15:03', 1],
      ['漏水告警', '2026-09-19 14:47:38', 1], ['水质异常告警', '2026-09-18 09:23:11', 1],
    ],
  },
  steam: {
    tab: '蒸汽监测',
    c1: {
      title: '锅炉房监控',
      stats: [['安全运行', '962', '天'], ['用汽评分', '88.50', '分'], ['锅炉数量', '2', '个'], ['监测点数量', '12', '个']],
      loadTitle: '蒸汽压力监控',
      loads: [['实时蒸汽压力', '0.82', 'MPa'], ['实时压力率', '68.30', '%'], ['今日最大蒸汽压力', '0.95', 'MPa'], ['今日最小蒸汽压力', '0.71', 'MPa']],
      chartTitle: '实时蒸汽压力',
      chart: { unit: 'MPa', yMax: 1, x: X_LABELS, series: [
        { name: '蒸汽总管', color: '#3E9BE0', data: d5([0.82, 0.84, 0.80, 0.86, 0.88, 0.85, 0.83, 0.81, 0.82, 0.84, 0.86, 0.83, 0.82, 0.83, 0.82]) },
        { name: '1#锅炉', color: '#FF8A3D', data: d5([0.90, 0.92, 0.88, 0.93, 0.95, 0.92, 0.90, 0.88, 0.90, 0.91, 0.93, 0.90, 0.89, 0.90, 0.89]) },
      ]},
    },
    c2: {
      title: '蒸汽消耗监控', word: '用汽量', unit: 't', today: 58.6, yest: 54.2, ratio: 8.1,
      blocks: [
        { kind: 'donut', title: '各区域用汽占比', slices: [['硫化车间', 24.6, REGION[0]], ['成型车间', 18.2, REGION[1]], ['烘干线', 10.4, REGION[2]], ['其他', 5.4, REGION[3]]] },
        { kind: 'hbar', title: '今日用汽top5', unit: 't', max: 30, items: [['硫化车间', 24.6], ['成型车间', 18.2], ['烘干线', 10.4], ['食堂', 3.8], ['办公区', 1.6]] },
      ],
    },
    c3: { title: '蒸汽表监控', cols: '200px minmax(0,1fr)' },
    alarms: [['告警支路', 3], ['未解除告警', 1], ['离线设备', 0]],
    alarmList: [
      ['蒸汽压力异常告警', '2026-09-29 07:58:20', 0], ['管道泄漏告警', '2026-09-28 10:31:44', 1],
      ['蒸汽温度异常告警', '2026-09-26 15:09:37', 1], ['锅炉故障告警', '2026-09-24 20:14:02', 1],
      ['冷凝水回收异常告警', '2026-09-23 16:42:57', 1], ['流量异常告警', '2026-09-22 11:28:40', 1],
      ['锅炉故障告警', '2026-09-21 06:55:19', 1], ['蒸汽压力异常告警', '2026-09-19 20:31:46', 1],
      ['蒸汽温度异常告警', '2026-09-18 15:07:22', 1], ['管道泄漏告警', '2026-09-17 08:49:55', 1],
    ],
  },
  gas: {
    tab: '天燃气监测',
    c1: {
      title: '调压站监控',
      stats: [['安全运行', '1120', '天'], ['用气评分', '90.00', '分'], ['调压站数量', '1', '个'], ['监测点数量', '8', '个']],
      loadTitle: '气压监控',
      loads: [['实时气压', '0.35', 'MPa'], ['实时气压率', '70.00', '%'], ['今日最大气压', '0.41', 'MPa'], ['今日最小气压', '0.30', 'MPa']],
      chartTitle: '实时气压',
      chart: { unit: 'MPa', yMax: 0.6, x: X_LABELS, series: [
        { name: '进气总管', color: '#3E9BE0', data: d5([0.62, 0.61, 0.63, 0.62, 0.60, 0.61, 0.62, 0.63, 0.61, 0.60, 0.62, 0.61, 0.62, 0.61, 0.62]) },
        { name: '出站压力', color: '#FF8A3D', data: d5([0.35, 0.36, 0.34, 0.35, 0.37, 0.36, 0.35, 0.34, 0.35, 0.36, 0.35, 0.34, 0.35, 0.35, 0.35]) },
      ]},
    },
    c2: {
      title: '气量监控', word: '气量', unit: 'm³', today: 1268.4, yest: 1195.2, ratio: 6.1,
      blocks: [
        { kind: 'donut', title: '各区域用气占比', slices: [['熔炼车间', 586, REGION[0]], ['热处理', 342, REGION[1]], ['食堂', 188, REGION[2]], ['其他', 152.4, REGION[3]]] },
        { kind: 'hbar', title: '今日用气top5', unit: 'm³', max: 400, items: [['热处理', 342], ['熔炼一车间', 326], ['熔炼二车间', 260], ['食堂', 188], ['其他', 152]] },
      ],
    },
    c3: { title: '气表监控', cols: '200px minmax(0,1fr)' },
    alarms: [['告警支路', 2], ['未解除告警', 1], ['离线设备', 1]],
    alarmList: [
      ['燃气泄漏告警', '2026-09-29 10:02:47', 0], ['浓度超标告警', '2026-09-28 09:26:13', 1],
      ['气压异常告警', '2026-09-27 17:44:29', 1], ['阀门异常告警', '2026-09-25 12:38:56', 1],
      ['调压设备故障告警', '2026-09-23 09:18:41', 1], ['流量异常告警', '2026-09-22 18:02:16', 1],
      ['气压异常告警', '2026-09-21 11:44:09', 1], ['浓度超标告警', '2026-09-20 07:29:53', 1],
      ['燃气泄漏告警', '2026-09-18 22:16:37', 1],
    ],
  },
};

/* ==================== HIER（完整三级场景的原始层级） ==================== */
const HIER = {
  power: {
    stations: [['1#变电站', ['1#变压器']]],
    devData: {
      '1#变压器': {
        blocks: [
          { title: '实时需量', big: ['35.17', 'kW'], kv: [['本月最大', '137.65kW'], ['发生时间', '2026-09-18 21:22']] },
          { title: '总功率因数', big: ['0.964', ''], kv: [['无功功率', '12.5 kvar']] },
        ],
        rt: [
          [['A相电流', '1.811'], ['B相电流', '2.177'], ['C相电流', '2.322']],
          [['AB线电压', '10398.774'], ['BC线电压', '10368.144'], ['CA线电压', '10372.096']],
          [['A相有功功率', '0'], ['B相有功功率', '0'], ['C相有功功率', '0']],
        ],
      },
    },
  },
  water: {
    stations: [['1#水泵房', ['1#水表', '2#水表']]],
    devData: {
      '1#水表': {
        blocks: [
          { title: '实时流量', big: ['26.84', 'm³/h'], kv: [['本月最大', '41.20 m³/h'], ['发生时间', '2026-09-12 09:40']] },
        ],
        rt: [[['进水压力', '0.38 MPa'], ['出水压力', '0.42 MPa'], ['瞬时流量', '26.84 m³/h']], [['累计流量', '18632.5 m³'], ['水温', '18.6 ℃'], ['PH值', '7.2']], [['1#泵频率', '42.5 Hz'], ['2#泵频率', '38.0 Hz'], ['浊度', '0.8 NTU']]],
      },
      '2#水表': {
        blocks: [
          { title: '实时流量', big: ['12.36', 'm³/h'], kv: [['本月最大', '19.80 m³/h'], ['发生时间', '2026-09-14 15:26']] },
        ],
        rt: [[['进水压力', '0.36 MPa'], ['出水压力', '0.40 MPa'], ['瞬时流量', '12.36 m³/h']], [['累计流量', '9426.8 m³'], ['水温', '19.2 ℃'], ['PH值', '7.3']], [['1#泵频率', '42.5 Hz'], ['2#泵频率', '38.0 Hz'], ['浊度', '0.7 NTU']]],
      },
    },
  },
  steam: {
    stations: [['1#锅炉房', ['1#蒸汽表', '2#蒸汽表']]],
    devData: {
      '1#蒸汽表': {
        blocks: [
          { title: '实时流量', big: ['3.42', 't/h'], kv: [['本月最大', '5.86 t/h'], ['发生时间', '2026-09-15 07:12']] },
        ],
        rt: [[['蒸汽压力', '0.82 MPa'], ['蒸汽温度', '175.4 ℃'], ['瞬时流量', '3.42 t/h']], [['累计流量', '1286.4 t'], ['焓值', '2772 kJ/kg'], ['排烟温度', '148.2 ']], [['1#炉负荷', '68 %'], ['2#炉负荷', '54 %'], ['给水温度', '96.5 ℃']]],
      },
      '2#蒸汽表': {
        blocks: [
          { title: '实时流量', big: ['2.18', 't/h'], kv: [['本月最大', '3.94 t/h'], ['发生时间', '2026-09-16 06:48']] },
        ],
        rt: [[['蒸汽压力', '0.78 MPa'], ['蒸汽温度', '168.9 ℃'], ['瞬时流量', '2.18 t/h']], [['累计流量', '864.2 t'], ['焓值', '2758 kJ/kg'], ['排烟温度', '152.6 ℃']], [['1#炉负荷', '68 %'], ['2#炉负荷', '54 %'], ['给水温度', '94.8 ']]],
      },
    },
  },
  gas: {
    stations: [['1#调压站', ['1#气表', '2#气表']]],
    devData: {
      '1#气表': {
        blocks: [
          { title: '实时流量', big: ['86.52', 'm³/h'], kv: [['本月最大', '132.40 m³/h'], ['发生时间', '2026-09-20 18:05']] },
        ],
        rt: [[['进气压力', '0.62 MPa'], ['出气压力', '0.35 MPa'], ['瞬时流量', '86.52 m³/h']], [['累计流量', '452186.2 m³'], ['燃气浓度', '0.00 %LEL'], ['温度', '21.4 ℃']], [['调压阀开度', '62 %'], ['切断阀状态', '正常'], ['流量计数', '4521']]],
      },
      '2#气表': {
        blocks: [
          { title: '实时流量', big: ['45.18', 'm³/h'], kv: [['本月最大', '72.60 m³/h'], ['发生时间', '2026-09-21 11:36']] },
        ],
        rt: [[['进气压力', '0.60 MPa'], ['出气压力', '0.34 MPa'], ['瞬时流量', '45.18 m³/h']], [['累计流量', '268432.7 m³'], ['燃气浓度', '0.00 %LEL'], ['温度', '20.8 ℃']], [['调压阀开度', '55 %'], ['切断阀状态', '正常'], ['流量计数', '2684']]],
      },
    },
  },
};

/* ==================== 场景配置 ==================== */
const SCENARIOS = {
  full:   { name: '完整三级',       desc: '变电站→变压器→回路', hasL1: true,  hasL2: true  },
  full2:  { name: '完整二级',       desc: '站房→回路',         hasL1: true,  hasL2: false },
  noL1:   { name: '无站点有设备',   desc: '变压器→回路',       hasL1: false, hasL2: true  },
  direct: { name: '直挂回路',       desc: '仅回路',            hasL1: false, hasL2: false },
};

/* 每种能源类型对应的场景列表 */
const SCENARIO_MAP = {
  power: ['full', 'noL1', 'direct'],
  water: ['full2', 'direct'],
  steam: ['full2', 'direct'],
  gas:   ['full2', 'direct'],
};

/* 非完整场景的层级覆盖 */
const HIER_OVERRIDES = {
  full2: {
    water: { stations: [['1#水泵房', ['生产水回路', '冷却水回路']], ['2#水泵房', ['办公水回路', '生活水回路']]], devData: {} },
    steam: { stations: [['1#锅炉房', ['生产蒸汽回路', '供暖蒸汽回路']], ['2#锅炉房', ['办公蒸汽回路', '食堂蒸汽回路']]], devData: {} },
    gas:   { stations: [['1#调压站', ['生产燃气回路', '熔炼燃气回路']], ['2#调压站', ['食堂燃气回路', '供暖燃气回路']]], devData: {} },
  },
  noL1: {
    power: {
      stations: [['总进线', ['1#变压器', '2#变压器']]],
      devData: {
        '1#变压器': HIER.power.devData['1#变压器'],
        '2#变压器': {
          blocks: [
            { title: '实时需量', big: ['28.43', 'kW'], kv: [['本月最大', '112.30kW'], ['发生时间', '2026-09-19 14:35']] },
            { title: '总功率因数', big: ['0.952', ''], kv: [['无功功率', '10.8 kvar']] },
          ],
          rt: [[['A相电流', '1.523'], ['B相电流', '1.842'], ['C相电流', '1.967']], [['AB线电压', '10385.221'], ['BC线电压', '10362.887'], ['CA线电压', '10370.554']], [['A相有功功率', '0'], ['B相有功功率', '0'], ['C相有功功率', '0']]],
        },
      },
    },
    water: { stations: [['市政进水', ['1#水表', '2#水表']]], devData: HIER.water.devData },
    steam: { stations: [['外购蒸汽', ['1#蒸汽表', '2#蒸汽表']]], devData: HIER.steam.devData },
    gas:   { stations: [['市政进气', ['1#气表', '2#气表']]],     devData: HIER.gas.devData   },
  },
  direct: {
    power: { stations: [['总进线', ['1#回路', '2#回路', '车间总回路', '办公区回路', '宿舍区回路']]], devData: {} },
    water: { stations: [['市政进水', ['生产回路', '冷却回路', '办公回路', '宿舍回路']]],             devData: {} },
    steam: { stations: [['外购蒸汽', ['硫化回路', '成型回路', '烘干回路', '食堂回路']]],             devData: {} },
    gas:   { stations: [['市政进气', ['熔炼回路', '热处理回路', '食堂回路', '其他回路']]],           devData: {} },
  },
};

/* 回路级数据（用于无L2场景的Card3展示） */
const CIRCUITS = {
  power: [
    { id:'c1', name:'1#回路', area:'车间', meter:{brand:'威胜',model:'DT862-400'},
      rt:[[['A相电流','45.2'],['B相电流','43.8'],['C相电流','46.1']],[['AB线电压','380.2'],['BC线电压','379.8'],['CA线电压','380.5']],[['A相有功功率','12.5'],['B相有功功率','11.8'],['C相有功功率','13.2']]],
      demand:['35.17','kW'], demandMax:['137.65kW','2026-09-18 21:22'], pf:['0.964',''], pfPhases:[['A相功率因数','0.98'],['B相功率因数','0.97'],['C相功率因数','0.95']] },
    { id:'c2', name:'2#回路', area:'车间', meter:{brand:'威胜',model:'DT862-400'},
      rt:[[['A相电流','38.6'],['B相电流','37.2'],['C相电流','39.1']],[['AB线电压','379.5'],['BC线电压','380.1'],['CA线电压','379.8']],[['A相有功功率','10.2'],['B相有功功率','9.8'],['C相有功功率','10.5']]],
      demand:['28.43','kW'], demandMax:['112.30kW','2026-09-19 14:35'], pf:['0.952',''], pfPhases:[['A相功率因数','0.97'],['B相功率因数','0.95'],['C相功率因数','0.93']] },
    { id:'c3', name:'车间总回路', area:'车间', meter:{brand:'威胜',model:'DT862-400'},
      rt:[[['A相电流','120.5'],['B相电流','118.3'],['C相电流','122.1']],[['AB线电压','380.0'],['BC线电压','379.9'],['CA线电压','380.2']],[['A相有功功率','35.2'],['B相有功功率','34.1'],['C相有功功率','36.0']]],
      demand:['57.83','kW'], demandMax:['123.00kW','2026-09-28 10:15'], pf:['0.960',''], pfPhases:[['A相功率因数','0.98'],['B相功率因数','0.96'],['C相功率因数','0.94']] },
    { id:'c4', name:'办公区回路', area:'办公区', meter:{brand:'威胜',model:'DT862-100'},
      rt:[[['A相电流','12.3'],['B相电流','11.8'],['C相电流','12.6']],[['AB线电压','220.1'],['BC线电压','219.8'],['CA线电压','220.3']],[['A相有功功率','2.5'],['B相有功功率','2.3'],['C相有功功率','2.6']]],
      demand:['8.20','kW'], demandMax:['15.60kW','2026-09-25 14:20'], pf:['0.970',''], pfPhases:[['A相功率因数','0.99'],['B相功率因数','0.97'],['C相功率因数','0.95']] },
    { id:'c5', name:'宿舍区回路', area:'宿舍区', meter:{brand:'威胜',model:'DT862-100'},
      rt:[[['A相电流','8.5'],['B相电流','7.9'],['C相电流','8.8']],[['AB线电压','220.0'],['BC线电压','219.9'],['CA线电压','220.1']],[['A相有功功率','1.7'],['B相有功功率','1.6'],['C相有功功率','1.8']]],
      demand:['5.60','kW'], demandMax:['10.20kW','2026-09-26 19:30'], pf:['0.965',''], pfPhases:[['A相功率因数','0.98'],['B相功率因数','0.96'],['C相功率因数','0.95']] },
  ],
  water: [
    { id:'w1', name:'生产回路', area:'生产区', meter:{brand:'宁波水表',model:'LXS-200'},
      rt:[[['进水压力','0.38 MPa'],['出水压力','0.42 MPa'],['瞬时流量','26.84 m³/h']],[['累计流量','18632.5 m³'],['水温','18.6 ℃'],['PH值','7.2']],[['回路状态','正常'],['阀门开度','85%'],['浊度','0.8 NTU']]],
      flowMax:['41.20 m³/h','2026-09-12 09:40'] },
    { id:'w2', name:'冷却回路', area:'生产区', meter:{brand:'宁波水表',model:'LXS-150'},
      rt:[[['进水压力','0.36 MPa'],['出水压力','0.40 MPa'],['瞬时流量','18.52 m³/h']],[['累计流量','12456.3 m³'],['水温','22.4 ℃'],['PH值','7.1']],[['回路状态','正常'],['阀门开度','72%'],['浊度','0.6 NTU']]],
      flowMax:['28.60 m³/h','2026-09-14 15:26'] },
    { id:'w3', name:'办公回路', area:'办公区', meter:{brand:'宁波水表',model:'LXS-100'},
      rt:[[['进水压力','0.35 MPa'],['出水压力','0.38 MPa'],['瞬时流量','8.36 m³/h']],[['累计流量','5234.8 m³'],['水温','19.2 ℃'],['PH值','7.3']],[['回路状态','正常'],['阀门开度','60%'],['浊度','0.5 NTU']]],
      flowMax:['15.80 m³/h','2026-09-15 10:30'] },
    { id:'w4', name:'宿舍回路', area:'宿舍区', meter:{brand:'宁波水表',model:'LXS-100'},
      rt:[[['进水压力','0.34 MPa'],['出水压力','0.37 MPa'],['瞬时流量','5.24 m³/h']],[['累计流量','3128.6 m³'],['水温','20.1 '],['PH值','7.2']],[['回路状态','正常'],['阀门开度','45%'],['浊度','0.4 NTU']]],
      flowMax:['9.50 m³/h','2026-09-16 08:15'] },
  ],
  steam: [
    { id:'s1', name:'硫化回路', area:'硫化车间', meter:{brand:'开封仪表',model:'LUGB-200'},
      rt:[[['蒸汽压力','0.82 MPa'],['蒸汽温度','175.4 ℃'],['瞬时流量','3.42 t/h']],[['累计流量','1286.4 t'],['焓值','2772 kJ/kg'],['排烟温度','148.2 ℃']],[['回路状态','正常'],['疏水阀','正常'],['保温','良好']]],
      flowMax:['5.86 t/h','2026-09-15 07:12'] },
    { id:'s2', name:'成型回路', area:'成型车间', meter:{brand:'开封仪表',model:'LUGB-150'},
      rt:[[['蒸汽压力','0.78 MPa'],['蒸汽温度','168.9 ℃'],['瞬时流量','2.18 t/h']],[['累计流量','864.2 t'],['焓值','2758 kJ/kg'],['排烟温度','152.6 ℃']],[['回路状态','正常'],['疏水阀','正常'],['保温','良好']]],
      flowMax:['3.94 t/h','2026-09-16 06:48'] },
    { id:'s3', name:'烘干回路', area:'烘干线', meter:{brand:'开封仪表',model:'LUGB-100'},
      rt:[[['蒸汽压力','0.75 MPa'],['蒸汽温度','165.2 ℃'],['瞬时流量','1.56 t/h']],[['累计流量','542.8 t'],['焓值','2745 kJ/kg'],['排烟温度','155.8 ']],[['回路状态','正常'],['疏水阀','正常'],['保温','良好']]],
      flowMax:['2.80 t/h','2026-09-17 09:20'] },
    { id:'s4', name:'食堂回路', area:'食堂', meter:{brand:'开封仪表',model:'LUGB-80'},
      rt:[[['蒸汽压力','0.70 MPa'],['蒸汽温度','160.5 ℃'],['瞬时流量','0.82 t/h']],[['累计流量','286.4 t'],['值','2732 kJ/kg'],['排烟温度','158.2 ℃']],[['回路状态','正常'],['疏水阀','正常'],['保温','良好']]],
      flowMax:['1.50 t/h','2026-09-18 11:35'] },
  ],
  gas: [
    { id:'g1', name:'熔炼回路', area:'熔炼车间', meter:{brand:'金卡智能',model:'G250'},
      rt:[[['进气压力','0.62 MPa'],['出气压力','0.35 MPa'],['瞬时流量','86.52 m³/h']],[['累计流量','452186.2 m³'],['燃气浓度','0.00 %LEL'],['温度','21.4 ℃']],[['调压阀开度','62%'],['回路状态','正常'],['流量计数','4521']]],
      flowMax:['132.40 m³/h','2026-09-20 18:05'] },
    { id:'g2', name:'热处理回路', area:'热处理', meter:{brand:'金卡智能',model:'G160'},
      rt:[[['进气压力','0.60 MPa'],['出气压力','0.34 MPa'],['瞬时流量','45.18 m³/h']],[['累计流量','268432.7 m³'],['燃气浓度','0.00 %LEL'],['温度','20.8 ℃']],[['调压阀开度','55%'],['回路状态','正常'],['流量计数','2684']]],
      flowMax:['72.60 m³/h','2026-09-21 11:36'] },
    { id:'g3', name:'食堂回路', area:'食堂', meter:{brand:'金卡智能',model:'G100'},
      rt:[[['进气压力','0.58 MPa'],['出气压力','0.33 MPa'],['瞬时流量','22.64 m³/h']],[['累计流量','142568.4 m³'],['燃气浓度','0.00 %LEL'],['温度','20.2 ℃']],[['调压阀开度','48%'],['回路状态','正常'],['流量计数','1425']]],
      flowMax:['38.50 m³/h','2026-09-22 14:20'] },
    { id:'g4', name:'其他回路', area:'其他', meter:{brand:'金卡智能',model:'G80'},
      rt:[[['进气压力','0.56 MPa'],['出气压力','0.32 MPa'],['瞬时流量','12.36 m³/h']],[['累计流量','86245.8 m³'],['燃气浓度','0.00 %LEL'],['温度','19.8 ℃']],[['调压阀开度','38%'],['回路状态','正常'],['流量计数','862']]],
      flowMax:['22.80 m³/h','2026-09-23 16:45'] },
  ],
};

/* ==================== 状态管理 ==================== */
const monState = { tab: 'power', period: '日', scenario: 'full', station: null, dev: null, circuit: null, hierLevel: 'station' };
if (TYPES[location.hash.replace('#', '')]) monState.tab = location.hash.replace('#', '');

function getHier() {
  const s = SCENARIOS[monState.scenario];
  if (s.hasL1 && s.hasL2) return HIER[monState.tab];
  return (HIER_OVERRIDES[monState.scenario] || {})[monState.tab] || HIER[monState.tab];
}

function getCircuits() {
  return CIRCUITS[monState.tab] || [];
}

function syncHier() {
  const h = getHier();
  const s = SCENARIOS[monState.scenario];
  if (s.hasL1 && s.hasL2) {
    const st = h.stations.find(([n]) => n === monState.station) || h.stations[0];
    monState.station = st[0];
    if (monState.hierLevel === 'dev') {
      if (!st[1].includes(monState.dev)) monState.dev = st[1][0];
    } else {
      monState.dev = null;
    }
  } else if (!s.hasL1 && s.hasL2) {
    /* 无站点：station设为第一个站点的名称（隐式），dev从stations中取 */
    const st = h.stations[0];
    monState.station = st[0];
    if (monState.hierLevel === 'dev') {
      if (!st[1].includes(monState.dev)) monState.dev = st[1][0];
    } else {
      monState.dev = null;
    }
  } else if (s.hasL1 && !s.hasL2) {
    const st = h.stations.find(([n]) => n === monState.station) || h.stations[0];
    monState.station = st[0];
    if (monState.scenario === 'full2') {
      /* 完整二级：回路默认为"请选择" */
      monState.circuit = null;
    } else {
      /* 其他情况：从CIRCUITS中获取 */
      const circuits = getCircuits();
      if (!circuits.find(c => c.name === monState.circuit)) monState.circuit = circuits[0]?.name || null;
    }
  } else {
    /* 直挂回路 */
    const circuits = getCircuits();
    if (!circuits.find(c => c.name === monState.circuit)) monState.circuit = circuits[0]?.name || null;
  }
}
syncHier();

const PERIOD = {
  日: { factor: 1, cur: '今日', prev: '昨日同期' },
  月: { factor: 30, cur: '本月', prev: '上月同期' },
  年: { factor: 365, cur: '本年', prev: '去年同期' },
};

/* ==================== 工具函数 ==================== */
function kvTable(rows) {
  return `<table class="kv-table">${rows.map(([k, v]) => `<tr><td class="k">${k}</td><td class="v">${v}</td></tr>`).join('')}</table>`;
}

const GRADE_WORD = { A: '优秀', B: '良好', C: '一般', D: '较差' };
function gradeOf(lb, num) {
  if (!lb.endsWith('评分')) return '';
  const v = parseFloat(num);
  return v >= 90 ? 'A' : v >= 80 ? 'B' : v >= 70 ? 'C' : 'D';
}

/* 场景感知的 Card1 标题和统计标签 */
function card1Adapt(t) {
  const s = SCENARIOS[monState.scenario];
  const typeLabels = {
    power: { l1: '变电站', l2: '变压器', direct: '进线', statL2: '变压器数量', statNoL2: '回路数量' },
    water: { l1: '水泵房', l2: '水表',   direct: '出水', statL2: '水泵数量',   statNoL2: '回路数量' },
    steam: { l1: '锅炉房', l2: '蒸汽表', direct: '进汽', statL2: '锅炉数量',   statNoL2: '回路数量' },
    gas:   { l1: '调压站', l2: '气表',   direct: '进气', statL2: '调压站数量', statNoL2: '回路数量' },
  };
  const tl = typeLabels[monState.tab];
  let title, statLabel;
  if (s.hasL1) {
    title = t.c1.title; // 保留原标题（变电站监控等）
    statLabel = s.hasL2 ? tl.statL2 : tl.statNoL2;
  } else if (s.hasL2) {
    title = `${tl.l2}监控`;
    statLabel = tl.statL2;
  } else {
    title = `${tl.direct}监控`;
    statLabel = tl.statNoL2;
  }
  const stats = t.c1.stats.map(([lb, num, unit]) => {
    if (lb === t.c1.stats[2][0]) return [statLabel, num, unit]; // 替换第三个统计项标签
    return [lb, num, unit];
  });
  return { title, stats };
}

/* 场景感知的 Card2 donut 标题和数据 */
function card2Blocks(t) {
  const s = SCENARIOS[monState.scenario];
  const blocks = [...t.c2.blocks];
  if (monState.tab === 'power') {
    if (s.hasL2) {
      /* 有变压器：根据层级显示变电站占比或变压器占比 */
      if (monState.scenario === 'full') {
        if (monState.hierLevel === 'station') {
          /* 变电站层级：显示变电站电量占比 */
          const h = getHier();
          const colors = ['#FF8A3D', '#3E9BE0', '#2BA245', '#FFC53D', '#9270CA'];
          blocks[1] = {
            kind: 'donut',
            title: '变电站电量占比',
            slices: h.stations.map(([name], i) => [name, Math.round(100 / h.stations.length), colors[i % colors.length]]),
          };
        } else {
          /* 变压器层级：显示变压器电量占比 */
          const h = getHier();
          const curSt = h.stations.find(([n]) => n === monState.station) || h.stations[0];
          const devs = curSt ? curSt[1] : [];
          const colors = ['#FF8A3D', '#3E9BE0', '#2BA245', '#FFC53D', '#9270CA'];
          blocks[1] = {
            kind: 'donut',
            title: '变压器电量占比',
            slices: devs.map((name, i) => [name, Math.round(100 / devs.length), colors[i % colors.length]]),
          };
        }
      } else if (monState.scenario === 'noL1') {
        blocks[1] = { kind: 'donut', title: '变压器电量占比', slices: [['1#变压器', 62, '#FF8A3D'], ['2#变压器', 38, '#3E9BE0']] };
      }
    } else {
      /* 无变压器：显示回路占比 */
      const circuits = getCircuits();
      const total = circuits.reduce((sum, c) => sum + (c.demand ? parseFloat(c.demand[0]) : 30), 0);
      const colors = ['#3E9BE0', '#2BA245', '#FFC53D', '#9270CA', '#FF8A3D'];
      blocks[1] = {
        kind: 'donut',
        title: '回路电量占比',
        slices: circuits.map((c, i) => [c.name, Math.round((parseFloat(c.demand?.[0] || 30) / total) * 100), colors[i % colors.length]]),
      };
    }
  }
  /* 水/蒸汽/天然气：无L2时显示回路用量占比 */
  if (monState.tab !== 'power' && !s.hasL2) {
    const circuits = getCircuits();
    const colors = ['#3E9BE0', '#2BA245', '#FFC53D', '#9270CA'];
    const unitMap = { water: 'm³', steam: 't', gas: 'm³' };
    const values = [128, 96, 52, 34]; // mock values
    blocks[0] = {
      kind: 'donut',
      title: '回路用量占比',
      slices: circuits.map((c, i) => [c.name, values[i] || 30, colors[i % colors.length]]),
    };
  }
  return blocks;
}

/* 获取当前选中的回路数据 */
function getCircuitData() {
  const circuits = getCircuits();
  return circuits.find(c => c.name === monState.circuit) || circuits[0];
}

/* ==================== Card 渲染 ==================== */
function card1HTML(t) {
  const adapted = card1Adapt(t);

  return `
  <section class="card-liner">
    <div class="card-title">${adapted.title}<span class="tri">▶</span></div>
    <div class="card-body c1-body">
      <div class="stat-grid">
        ${adapted.stats.map(([lb, num, unit]) => {
          const g = gradeOf(lb, num);
          const body = g
            ? `<div class="grade grade-${g}">${GRADE_WORD[g]}</div><div class="score-row"><span class="num">${num}</span><span class="unit">${unit}</span></div>`
            : `<div class="num">${num}</div><div class="unit">${unit}</div>`;
          return `<div class="stat-tile"><div class="lb">${lb}</div>${body}</div>`;
        }).join('')}
      </div>
      <div>
        <div class="blk-title">${t.c1.loadTitle}</div>
        <div class="gray-grid">
          ${t.c1.loads.map(([lb, num]) => `<div class="gray-tile"><div class="lb">${lb}</div><div class="num">${num}</div></div>`).join('')}
        </div>
      </div>
      <div>
        <div class="blk-title">${t.c1.chartTitle}</div>
        <div id="chLoad"></div>
      </div>
    </div>
  </section>`;
}

function card2HTML(t) {
  const p = PERIOD[monState.period];
  const f = p.factor;
  const blocks = card2Blocks(t);
  const blocksHTML = blocks.map((b, i) => `
    <div>
      <div class="blk-title">${b.kind === 'hbar' ? b.title.replace('今日', p.cur) : b.title}</div>
      <div id="c2b${i}"></div>
    </div>`).join('');

  return `
  <section class="card-liner">
    <div class="card-title">${t.c2.title}<span class="tri">▶</span>
      <div class="tools">
        <div class="seg" id="segPeriod">
          ${Object.keys(PERIOD).map((k) => `<span class="${k === monState.period ? 'on' : ''}" data-p="${k}">${k}</span>`).join('')}
        </div>
      </div>
    </div>
    <div class="card-body c2-body" style="grid-template-columns:230px ${blocks.map(() => 'minmax(0,1fr)').join(' ')}">
      <div class="liner-small energy-panel">
        <div class="lb">${p.cur}${t.c2.word}</div>
        <div class="num">${(t.c2.today * f).toFixed(1)}</div>
        <div class="unit">${t.c2.unit}</div>
        <div class="lb">${p.prev}${t.c2.word}</div>
        <div class="num">${(t.c2.yest * f).toFixed(1)}</div>
        <div class="unit">${t.c2.unit}</div>
        <div class="ratio"><span>同期环比</span><b>${t.c2.ratio}% ▲</b></div>
      </div>
      ${blocksHTML}
    </div>
  </section>`;
}

function card3HTML(t) {
  const s = SCENARIOS[monState.scenario];
  const h = getHier();

  /* 有L2：显示设备级监控（原有逻辑） */
  if (s.hasL2) {
    /* 当dev为null时（请选择状态），使用第一个变压器的数据 */
    const devName = monState.dev || (h.stations.find(([n]) => n === monState.station) || h.stations[0])?.[1]?.[0];
    const d = h.devData[devName];
    if (!d) return '';

    const blocks = d.blocks.map((b) => `
      <div>
        <div class="blk-title">${b.title}</div>
        <div class="blk-row">
          ${b.big ? `<div class="big-num">${b.big[0]}<small>${b.big[1]}</small></div>` : ''}
          ${kvTable(b.kv)}
        </div>
      </div>`).join('');

    /* 当dev为null时显示下拉框，否则显示tag-btn */
    let toolsHTML = '';
    if (!monState.dev) {
      const curSt = h.stations.find(([n]) => n === monState.station) || h.stations[0];
      const devs = curSt ? curSt[1] : [];
      const devOpts = devs.map(name => `<option value="${name}">${name}</option>`).join('');
      toolsHTML = `<div class="tools"><select class="hier-select" id="card3DevSelect">${devOpts}</select></div>`;
    } else {
      toolsHTML = `<div class="tools"><span class="tag-btn">${monState.dev}</span></div>`;
    }

    return `
    <section class="card-liner">
      <div class="card-title">${t.c3.title}<span class="tri">▶</span>
        ${toolsHTML}
      </div>
      <div class="card-body c3-body" style="grid-template-columns:${t.c3.cols}">
        ${blocks}
        <div>
          <div class="blk-title">实时监控</div>
          <div class="rt-grid">${d.rt.map((g) => kvTable(g)).join('')}</div>
        </div>
      </div>
    </section>`;
  }

  /* 无L2：显示回路级监控 */
  const circuit = getCircuitData();
  const circuits = getCircuits();
  const isPower = monState.tab === 'power';

  /* 完整二级场景：回路选择器 */
  let toolsHTML = '';
  if (monState.scenario === 'full2') {
    if (!monState.circuit) {
      const curSt = h.stations.find(([n]) => n === monState.station) || h.stations[0];
      const circuitList = curSt ? curSt[1] : [];
      const circuitOpts = circuitList.map(c => `<option value="${c}">${c}</option>`).join('');
      toolsHTML = `<div class="tools"><select class="hier-select" id="card3CircuitSelect">${circuitOpts}</select></div>`;
    } else {
      toolsHTML = `<div class="tools"><span class="tag-btn">${monState.circuit}</span></div>`;
    }
  } else if (monState.scenario === 'direct') {
    /* 直挂回路场景：显示回路名称 */
    toolsHTML = `<div class="tools"><span class="tag-btn">${monState.circuit || ''}</span></div>`;
  }

  /* 需量/流量块 */
  let demandBlock = '';
  if (isPower) {
    demandBlock = `
      <div>
        <div class="blk-title">实时需量</div>
        <div class="blk-row">
          <div class="big-num">${circuit.demand[0]}<small>${circuit.demand[1]}</small></div>
          ${kvTable([['本月最大', circuit.demandMax[0]], ['发生时间', circuit.demandMax[1]]])}
        </div>
      </div>`;
  } else {
    const flowVal = circuit.rt[0][2][1]; // 瞬时流量
    demandBlock = `
      <div>
        <div class="blk-title">实时流量</div>
        <div class="blk-row">
          <div class="big-num">${flowVal.split(' ')[0]}<small>${flowVal.split(' ')[1] || ''}</small></div>
          ${kvTable([['本月最大', circuit.flowMax[0]], ['发生时间', circuit.flowMax[1]]])}
        </div>
      </div>`;
  }

  /* 功率因数块（仅电力） */
  const pfBlock = isPower ? `
    <div>
      <div class="blk-title">总功率因数</div>
      <div class="blk-row">
        <div class="big-num">${circuit.pf[0]}<small>${circuit.pf[1]}</small></div>
        ${kvTable(circuit.pfPhases)}
      </div>
    </div>` : '';

  return `
  <section class="card-liner">
    <div class="card-title">${monState.scenario === 'full2' ? '回路监控' : '回路监控'}<span class="tri">▶</span>${toolsHTML}</div>
    <div class="card-body c3-body" style="grid-template-columns:200px ${isPower ? '200px ' : ''}minmax(0,1fr)">
      ${demandBlock}
      ${pfBlock}
      <div>
        <div class="blk-title">实时监控</div>
        <div class="rt-grid">${circuit.rt.map((g) => kvTable(g)).join('')}</div>
      </div>
    </div>
  </section>`;
}

function card4HTML(t) {
  return `
  <section class="card-liner">
    <div class="card-title">告警统计<span class="tri">▶</span></div>
    <div class="card-body">
      <div class="alarm-grid">
        ${t.alarms.map(([lb, n]) => `
          <div class="liner-small alarm-tile">
            <div class="ic">${ICONS.warning}</div>
            <div class="num ${n > 0 ? 'hit' : ''}">${n}</div>
            <div class="lb">${lb}</div>
          </div>`).join('')}
      </div>
      <div class="border1" style="margin:2px 0 12px"></div>
      <div class="blk-title">报警
        <span class="right"><i class="sq" style="background:#2BA245"></i>已处理<i class="sq" style="background:#FF6A00"></i>未处理</span>
      </div>
      <div class="alarm-list">
        ${t.alarmList.map(([nm, tm, done], i) => `
          <div class="alarm-row${done ? '' : ' clickable'}" data-i="${i}">
            <span class="ic ${done ? '' : 'pending'}">${ICONS.warning}</span>
            <span class="nm">${nm}</span>
            <span class="tm">${tm}</span>
            <span class="st ${done ? '' : 'pending'}">${done ? '已处理' : '未处理'}</span>
          </div>`).join('')}
      </div>
    </div>
  </section>`;
}

/* ==================== 层级选择器（场景感知） ==================== */
function hierSelectHTML() {
  const s = SCENARIOS[monState.scenario];
  const h = getHier();

  if (!s.hasL1 && !s.hasL2) {
    const circuits = getCircuits();
    const opts = circuits.map(c => `<option value="${c.name}" ${c.name === monState.circuit ? 'selected' : ''}>${c.name}</option>`).join('');
    return `<div class="hier-bar"><span class="hier-lb">回路选择</span><select class="hier-select" id="hierCircuit">${opts}</select></div>`;
  }

  if (s.hasL1 && s.hasL2) {
    const stOpts = h.stations.map(([st]) => `<option value="${st}" ${st === monState.station ? 'selected' : ''}>${st}</option>`).join('');
    const curSt = h.stations.find(([n]) => n === monState.station) || h.stations[0];
    const devs = curSt ? curSt[1] : [];
    const devOpts = `<option value="">请选择</option>` + devs.map(d => `<option value="${d}" ${d === monState.dev ? 'selected' : ''}>${d}</option>`).join('');
    return `<div class="hier-bar">
      <span class="hier-lb">监测层级</span>
      <select class="hier-select" id="hierStation">${stOpts}</select>
      <span class="hier-arrow">▶</span>
      <select class="hier-select" id="hierDev">${devOpts}</select>
    </div>`;
  }

  if (!s.hasL1 && s.hasL2) {
    const devices = h.stations[0][1];
    const opts = devices.map(d => `<option value="${d}" ${d === monState.dev ? 'selected' : ''}>${d}</option>`).join('');
    return `<div class="hier-bar"><span class="hier-lb">计量设备</span><select class="hier-select" id="hierSelect">${opts}</select></div>`;
  }

  if (s.hasL1 && !s.hasL2) {
    /* 完整二级：站房→回路 */
    if (monState.scenario === 'full2') {
      const stOpts = h.stations.map(([st]) => `<option value="${st}" ${st === monState.station ? 'selected' : ''}>${st}</option>`).join('');
      const curSt = h.stations.find(([n]) => n === monState.station) || h.stations[0];
      const circuits = curSt ? curSt[1] : [];
      const circuitOpts = ['<option value="">请选择</option>'].concat(circuits.map(c => `<option value="${c}" ${c === monState.circuit ? 'selected' : ''}>${c}</option>`)).join('');
      return `<div class="hier-bar">
        <span class="hier-lb">监测层级</span>
        <select class="hier-select" id="hierStation">${stOpts}</select>
        <span class="hier-arrow">▶</span>
        <select class="hier-select" id="hierCircuit">${circuitOpts}</select>
      </div>`;
    }
    /* 其他情况：单个接入点下拉框 */
    const opts = h.stations.map(([st]) => `<option value="${st}" ${st === monState.station ? 'selected' : ''}>${st}</option>`).join('');
    return `<div class="hier-bar"><span class="hier-lb">接入点</span><select class="hier-select" id="hierSelect">${opts}</select></div>`;
  }

  return '';
}

/* ==================== 场景切换器 ==================== */
function scenarioSwitcherHTML() {
  const availableScenarios = SCENARIO_MAP[monState.tab] || ['full', 'noL1', 'direct'];
  return `
  <div class="scenario-bar">
    <span class="scenario-lb">场景切换</span>
    <div class="scenario-tabs">
      ${availableScenarios.map(key => {
        const val = SCENARIOS[key];
        return `<span class="scenario-tab ${key === monState.scenario ? 'active' : ''}" data-scenario="${key}" title="${val.desc}">${val.name}</span>`;
      }).join('')}
    </div>
  </div>`;
}

/* ==================== 主渲染 ==================== */
function renderMonitor() {
  const root = document.getElementById('content');
  const tabs = Object.entries(TYPES)
    .map(([k, v]) => `<div class="tab ${k === monState.tab ? 'active' : ''}" data-tab="${k}">${v.tab}</div>`)
    .join('');
  const t = TYPES[monState.tab];

  root.innerHTML = `
    <div class="tabs-card">${tabs}</div>
    ${scenarioSwitcherHTML()}
    ${hierSelectHTML()}
    <div class="mon-grid">
      <div class="mon-left">${card1HTML(t)}${card2HTML(t)}</div>
      <div class="mon-right">${card4HTML(t)}</div>
    </div>
    ${card3HTML(t)}`;

  /* 绘制图表 */
  chLine(document.getElementById('chLoad'), t.c1.chart);
  const blocks = card2Blocks(t);
  blocks.forEach((b, i) => {
    const el = document.getElementById('c2b' + i);
    if (!el) return;
    if (b.kind === 'donut') {
      chDonut(el, { slices: b.slices.map(([name, value, color]) => ({ name, value, color })) });
    } else {
      const f = PERIOD[monState.period].factor;
      chHBar(el, { unit: b.unit, max: b.max * f, items: b.items.map(([n, v]) => [n, v * f]) });
    }
  });

  /* 绑定事件 */
  /* Tab切换 */
  root.querySelector('.tabs-card').addEventListener('click', (e) => {
    const tab = e.target.closest('.tab');
    if (!tab || tab.dataset.tab === monState.tab) return;
    monState.tab = tab.dataset.tab;
    monState.station = null;
    monState.dev = null;
    monState.circuit = null;
    /* 确保场景对新能源类型有效 */
    const availableScenarios = SCENARIO_MAP[monState.tab] || ['full', 'noL1', 'direct'];
    if (!availableScenarios.includes(monState.scenario)) {
      monState.scenario = availableScenarios[0];
    }
    syncHier();
    history.replaceState(null, '', '#' + monState.tab);
    renderMonitor();
  });

  /* 场景切换 */
  root.querySelector('.scenario-tabs')?.addEventListener('click', (e) => {
    const tab = e.target.closest('.scenario-tab');
    if (!tab || tab.dataset.scenario === monState.scenario) return;
    monState.scenario = tab.dataset.scenario;
    monState.station = null;
    monState.dev = null;
    monState.circuit = null;
    const s = SCENARIOS[monState.scenario];
    monState.hierLevel = (s.hasL1 && s.hasL2) ? 'station' : 'dev';
    syncHier();
    renderMonitor();
  });

  /* 层级下拉 */
  const hierStation = root.querySelector('#hierStation');
  const hierDev = root.querySelector('#hierDev');
  const hierSelect = root.querySelector('#hierSelect');
  const hierCircuit = root.querySelector('#hierCircuit');

  if (hierStation) {
    hierStation.addEventListener('change', (e) => {
      const h = getHier();
      const st = h.stations.find(([n]) => n === e.target.value);
      if (!st) return;
      monState.station = st[0];
      const s = SCENARIOS[monState.scenario];
      if (s.hasL1 && s.hasL2) {
        /* 完整三级：更新dev */
        monState.dev = st[1][0];
        monState.hierLevel = 'station';
      } else if (monState.scenario === 'full2') {
        /* 完整二级：切换站房时回路重置为"请选择" */
        monState.circuit = null;
      }
      renderMonitor();
    });
  }
  if (hierDev) {
    hierDev.addEventListener('change', (e) => {
      if (e.target.value) {
        monState.dev = e.target.value;
        monState.hierLevel = 'dev';
      } else {
        monState.dev = null;
        monState.hierLevel = 'station';
      }
      renderMonitor();
    });
  }
  if (hierSelect) {
    hierSelect.addEventListener('change', (e) => {
      const s = SCENARIOS[monState.scenario];
      const h = getHier();
      if (!s.hasL1 && s.hasL2) {
        monState.dev = e.target.value;
      } else if (s.hasL1 && !s.hasL2) {
        monState.station = e.target.value;
        const circuits = getCircuits();
        monState.circuit = circuits[0]?.name || null;
      }
      renderMonitor();
    });
  }
  if (hierCircuit) {
    hierCircuit.addEventListener('change', (e) => {
      monState.circuit = e.target.value;
      renderMonitor();
    });
  }

  /* Card3变压器下拉框 */
  const card3DevSelect = root.querySelector('#card3DevSelect');
  if (card3DevSelect) {
    card3DevSelect.addEventListener('change', (e) => {
      monState.dev = e.target.value;
      monState.hierLevel = 'dev';
      renderMonitor();
    });
  }

  /* Card3回路下拉框（完整二级场景） */
  const card3CircuitSelect = root.querySelector('#card3CircuitSelect');
  if (card3CircuitSelect) {
    card3CircuitSelect.addEventListener('change', (e) => {
      monState.circuit = e.target.value;
      renderMonitor();
    });
  }

  /* 周期切换 */
  root.querySelector('#segPeriod')?.addEventListener('click', (e) => {
    const seg = e.target.closest('span[data-p]');
    if (!seg || seg.dataset.p === monState.period) return;
    monState.period = seg.dataset.p;
    renderMonitor();
  });

  /* 告警点击 */
  root.querySelectorAll('.alarm-row.clickable').forEach((row) => {
    row.addEventListener('click', () => openAlarmModal(row));
  });
}

/* ==================== 告警弹窗（不变） ==================== */
const ALARM_MODAL_HTML = `
<div class="modal-mask" id="alarmMask" hidden>
  <div class="modal" role="dialog" aria-modal="true" aria-label="报警确认">
    <div class="modal-head"><span class="modal-title">报警确认</span>
      <span class="modal-close" id="alarmClose"><svg viewBox="0 0 16 16"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9"/></svg></span>
    </div>
    <div class="modal-body"><textarea id="alarmResult" placeholder="请输入处理结果"></textarea></div>
    <div class="modal-foot">
      <button class="btn btn-plain" id="alarmCancel">取 消</button>
      <button class="btn btn-primary" id="alarmOk">确 定</button>
    </div>
  </div>
</div>`;

let alarmRowEl = null;
function mountAlarmModal() {
  document.body.insertAdjacentHTML('beforeend', ALARM_MODAL_HTML);
  const mask = document.getElementById('alarmMask');
  const close = () => { mask.hidden = true; alarmRowEl = null; };
  mask.addEventListener('click', (e) => { if (e.target === mask) close(); });
  document.getElementById('alarmClose').addEventListener('click', close);
  document.getElementById('alarmCancel').addEventListener('click', close);
  document.getElementById('alarmOk').addEventListener('click', () => {
    if (alarmRowEl) {
      TYPES[monState.tab].alarmList[+alarmRowEl.dataset.i][2] = 1;
      alarmRowEl.classList.remove('clickable');
      alarmRowEl.querySelector('.ic').classList.remove('pending');
      const st = alarmRowEl.querySelector('.st');
      st.classList.remove('pending');
      st.textContent = '已处理';
    }
    close();
  });
}
function openAlarmModal(row) {
  alarmRowEl = row;
  const mask = document.getElementById('alarmMask');
  document.getElementById('alarmResult').value = '';
  mask.hidden = false;
}

mountAlarmModal();

window.addEventListener('hashchange', () => {
  const k = location.hash.replace('#', '');
  if (TYPES[k] && k !== monState.tab) {
    monState.tab = k;
    monState.station = null;
    monState.dev = null;
    monState.circuit = null;
    syncHier();
    renderMonitor();
  }
});

renderMonitor();
