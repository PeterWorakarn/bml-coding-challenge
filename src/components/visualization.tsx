import React, { useState } from 'react'
import { TData } from '../App'
import { DatePicker } from 'antd';
import 'dayjs/locale/th';
import locale from 'antd/es/date-picker/locale/th_TH';
import dayjs from 'dayjs';

type TProps = {
  data: TData[];
  chartWidth: number;
}

type TYear = '2550' | '2551' | '2552' | '2553' | '2554' | '2555' | '2556' | '2557' | '2558' | '2559'

const yLabel = ['2550', '2551', '2552', '2553', '2554', '2555', '2556', '2557', '2558', '2559']
const hChart = 450;
const hObject = 16;
const spaceBetweenItem = Math.round((hChart - (hObject * yLabel.length)) / yLabel.length) + 3.25
const range = 10;

const calculateHeight = (idx: number) => {
  if (idx === 0) {
    return 0
  }
  return ((hObject + spaceBetweenItem) * idx);
}

const calculateWidth = (data: number, allWidth: number) => {
  // TODO: dynamic min - max based on data
  return (Math.abs(data) / range) * Math.round(allWidth / 2);
}

const { RangePicker } = DatePicker;

const extractMinMaxYear = (allData: TData) => {
  const arrYear = Object.keys(allData).filter((i) => {
    if (i !== 'dcode' && i !== 'name') {
      return true;
    }
  }).sort((a, b) => Number(a) - Number(b))
  return [arrYear[0], arrYear[arrYear.length - 1]];
}

const Visualization: React.FC<TProps> = (props) => {
  const wChart = props.chartWidth;
  const centerChart = Math.round(wChart / 2);
  const [selectData, setSelectData] = useState<TData>(props.data[0]);
  const provinceOption = props.data.map((eachProvince) => {
    return {
      value: eachProvince.dcode,
      label: eachProvince.name,
    }
  })

  return (
    <>
      <section className='mb-10'>
        <h2 className='h3 mb-2'>การเติบโต</h2>
        <div className='grid xl:grid-cols-2 grid-cols-1 gap-2'>
          <label className='col-span-1 p flex items-center justify-start gap-5'>
            <p className='p w-5'>
              เขต
            </p>
            <select className='bg-white text-dark h-8 p-1 rounded-lg w-full xl:w-fit'
              defaultValue={selectData.dcode}
              value={selectData.dcode}
              onChange={(e) => {
                setSelectData(props.data.find((select) => select.dcode === e.target.value)!)
              }}>
              {provinceOption.map((option) => {
                return (
                  <option className='p bg-dark text-white' key={option.value} value={option.value}>{option.label}</option>
                )
              })}
            </select>
          </label>

          <div className='col-span-1 p flex items-center xl:justify-end gap-5 pointer-events-none'>
            <label className='p flex items-center justify-start gap-5'>
              <p className='p w-5'>
                เวลา
              </p>
              <RangePicker
                value={
                  [dayjs(extractMinMaxYear(selectData)[0]), dayjs(extractMinMaxYear(selectData)[1])]
                }
                locale={locale}
                className='bg-white'
                picker="year"
                format={'พ.ศ. YYYY'}
              />
            </label>
          </div>
        </div>
      </section>
      <div className='flex flex-col items-center justify-center'>
        <section
          style={{
            height: `${hChart}px`,
            width: `${wChart}px`,
          }}
          className='relative my-10 -ml-11 xl:-ml-0'>
          <div className='y-axis absolute top-0 left-0 h-full flex flex-col justify-between'>
            {yLabel.map((eachLabel) => {
              return (
                <div
                  className='w-10 h-4 text-xs text-center' key={eachLabel}>{eachLabel}</div>
              )
            })}
          </div>
          <div className='absolute top-0  left-11 h-full w-full opacity-100 border-l border-r'>
            <div className='absolute -top-8 -left-5'>-10%</div>
            <div className='absolute -top-8 -right-5'>10%</div>
            <div style={{ left: `${centerChart}px` }} className='absolute h-full w-[1px] top-0 bg-white opacity-30'></div>
            <div style={{ left: `${Math.round(wChart / 2) - 5}px` }} className='absolute -top-8'>0</div>
            {yLabel.map((eachObject, idx) => {
              return (
                <div
                  key={idx}
                  id={`${selectData[eachObject as TYear]}`}
                  style={{
                    top: `${calculateHeight(idx)}px`,
                    transformOrigin: 'left',
                    transform: `rotate(${Math.sign(selectData[eachObject as TYear]) === 1 ? '0' : '180'}deg)`,
                    left: `${centerChart}px`,
                    width: `${calculateWidth(selectData[eachObject as TYear], wChart)}px`,
                  }}
                  className='absolute h-4 bg-primary'
                />
              )
            })}
          </div>

        </section>
      </div>
    </>
  )
}

export default Visualization