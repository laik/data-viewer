
const lineOption = {
	xAxis: {
		type: 'category',
		data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
	},
	yAxis: {
		type: 'value',
	},
	series: [
		{
			data: [150, 230, 224, 218, 135, 147, 260],
			type: 'line',
		},
	],
};

const candlestickOption = {
	xAxis: {
		data: ['2017-10-24', '2017-10-25', '2017-10-26', '2017-10-27'],
	},
	yAxis: {},
	series: [
		{
			type: 'candlestick',
			data: [
				[20, 34, 10, 38],
				[40, 35, 30, 50],
				[31, 38, 33, 44],
				[38, 15, 5, 42],
			],
		},
	],
};

export function createCandlestickOption(xAxis: [], yAxis: [], series: []): any {
	return {
		xAxis: {
			data: xAxis,
		},
		yAxis: {},
		series: [
			{
				type: 'candlestick',
				data: series,
			},
		],
	}
}

const electricityOption = {
	title: {
		text: 'Distribution of Electricity',
		subtext: 'Fake Data',
	},
	tooltip: {
		trigger: 'axis',
		axisPointer: {
			type: 'cross',
		},
	},
	toolbox: {
		show: true,
		feature: {
			saveAsImage: {},
		},
	},
	xAxis: {
		type: 'category',
		boundaryGap: false,
		// prettier-ignore
		data: ['00:00', '01:15', '02:30', '03:45', '05:00', '06:15', '07:30', '08:45', '10:00', '11:15', '12:30', '13:45', '15:00', '16:15', '17:30', '18:45', '20:00', '21:15', '22:30', '23:45'],
	},
	yAxis: {
		type: 'value',
		axisLabel: {
			formatter: '{value} W',
		},
		axisPointer: {
			snap: true,
		},
	},
	visualMap: {
		show: false,
		dimension: 0,
		pieces: [
			{
				lte: 6,
				color: 'green',
			},
			{
				gt: 6,
				lte: 8,
				color: 'red',
			},
			{
				gt: 8,
				lte: 14,
				color: 'green',
			},
			{
				gt: 14,
				lte: 17,
				color: 'red',
			},
			{
				gt: 17,
				color: 'green',
			},
		],
	},
	series: [
		{
			name: 'Electricity',
			type: 'line',
			smooth: true,
			// prettier-ignore
			data: [300, 280, 250, 260, 270, 300, 550, 500, 400, 390, 380, 390, 400, 500, 600, 750, 800, 700, 600, 400],
			markArea: {
				itemStyle: {
					color: 'rgba(255, 173, 177, 0.4)',
				},
				data: [
					[
						{
							name: 'Morning Peak',
							xAxis: '07:30',
						},
						{
							xAxis: '10:00',
						},
					],
					[
						{
							name: 'Evening Peak',
							xAxis: '17:30',
						},
						{
							xAxis: '21:15',
						},
					],
				],
			},
		},
	],
};

const pie1 = {
	tooltip: {
		trigger: 'item'
	},
	legend: {
		top: '5%',
		left: 'center'
	},
	series: [
		{
			name: 'Access From',
			type: 'pie',
			radius: ['40%', '70%'],
			avoidLabelOverlap: false,
			itemStyle: {
				borderRadius: 10,
				borderColor: '#fff',
				borderWidth: 2
			},
			label: {
				show: false,
				position: 'center'
			},
			emphasis: {
				label: {
					show: true,
					fontSize: '40',
					fontWeight: 'bold'
				}
			},
			labelLine: {
				show: false
			},
			data: [
				{ value: 1048, name: 'Search Engine' },
				{ value: 735, name: 'Direct' },
				{ value: 580, name: 'Email' },
				{ value: 484, name: 'Union Ads' },
				{ value: 300, name: 'Video Ads' }
			]
		}
	]
};

export const options = [lineOption, candlestickOption, electricityOption, pie1];