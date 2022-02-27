import Masonry from '@mui/lab/Masonry';
import * as echarts from 'echarts';
import { useEffect } from 'react';

export const ChartId = 'chart-masonry-'

export function ChartMasonry({ options, theme }) {
  let divs = [];

  useEffect(() => {
    options.forEach((option, index) => {
      const id = ChartId + index + 1;
      var chartDom = document.getElementById(id);
      if (chartDom) {
        var chart = echarts.init(chartDom, theme);
        chart.setOption(option);
      }
    });
  });

  options.forEach((option, index) => {
    const id = ChartId + index + 1;
    divs.push(<div id={id} key={id} style={{ minHeight: 400 }} />);
  });

  return (
    <Masonry columns={2} spacing={2}>
      {divs.map(item => item)}
    </Masonry>
  );
}
