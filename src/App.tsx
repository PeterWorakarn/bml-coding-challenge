import React, { useEffect, useState } from 'react';
import Papa from 'papaparse'
import Visualization from './components/visualization';
import useWindowDimensions from './use-window-dimensions';

type TPapa = {
  data: TRecord[]
}

type TRecord = {
  dcode: string,
  name: string,
  '2550': string,
  '2551': string,
  '2552': string,
  '2553': string,
  '2554': string,
  '2555': string,
  '2556': string,
  '2557': string,
  '2558': string,
  '2559': string,
}

export type TData = {
  dcode: string,
  name: string,
  2550: number,
  2551: number,
  2552: number,
  2553: number,
  2554: number,
  2555: number,
  2556: number,
  2557: number,
  2558: number,
  2559: number,
}

const transformData = (data: string) => {
  return Number(data.replace('%', ''));
}

const staticLink = {
  'mega-city': {
    title: "“อภิมหานคร (megacity)”",
    link: "https://en.wikipedia.org/wiki/Megacity"
  },
  'thai-ministry': {
    title: "สำนักบริหารการทะเบียน กรมการปกครอง กระทรวงมหาดไทย, จำนวนประชากร, สำนักบริหารการทะเบียน กรมการปกครอง กระทรวงมหาดไทย, Editor. 2564: กรุงเทพฯ.",
    link: "https://stat.bora.dopa.go.th/stat/statnew/statMONTH/statmonth/",
  },
  'thai-statistic': {
    title: "สำนักงานสถิติแห่งชาติ, การสำรวจภาวะเศรษฐกิจและสังคมของครัวเรือน พ.ศ. 2563 สำนักงานสถิติแห่งชาติ, Editor. 2563: กรุงเทพฯ",
    link: "http://www.nso.go.th/",
  },
  'thai-commerce': {
    title: "สำนักดัชนีเศรษฐกิจการค้า กระทรวงพาณิชย์, ข้อมูลดัชนีราคาผู้บริโภคทั่วไป, สำนักดัชนีเศรษฐกิจการค้า กระทรวงพาณิชย์, Editor. 2563: กรุงเทพฯ",
    link: "http://www.price.moc.go.th/",
  },
}

function App() {
  const [cleanData, setCleanData] = useState<TData[]>([]);
  const windowDimension = useWindowDimensions();

  useEffect(() => {
    async function getData() {
      const response = await fetch('/bkk_population_growth.csv')
      const reader = response.body?.getReader()
      const result = await reader?.read()
      const decoder = new TextDecoder('utf-8')
      const rawCSV = decoder.decode(result?.value);
      const rawJSON: TPapa = Papa.parse(rawCSV, {
        header: true,
        skipEmptyLines: true,
      })
      const cleanJSON = rawJSON.data.map((eachRecord) => {
        return {
          dcode: eachRecord.dcode,
          name: eachRecord.name,
          2550: transformData(eachRecord['2550']),
          2551: transformData(eachRecord['2551']),
          2552: transformData(eachRecord['2552']),
          2553: transformData(eachRecord['2553']),
          2554: transformData(eachRecord['2554']),
          2555: transformData(eachRecord['2555']),
          2556: transformData(eachRecord['2556']),
          2557: transformData(eachRecord['2557']),
          2558: transformData(eachRecord['2558']),
          2559: transformData(eachRecord['2559']),
        }
      })

      setCleanData(cleanJSON);
    }
    getData();
  }, [])
  return (
    <div className='bg-dark w-full h-full py-10'>
      <main className='container mx-auto'>
        <h1 className='h1 mb-5'>สถิติประชากรกรุงเทพฯ พ.ศ. 2550 - 2559</h1>
        <h2 className='h3 mb-2'>ลักษณะพื้นที่</h2>
        <p className='mb-20 p'>กรุงเทพฯ เป็นจังหวัดที่มีประชากรมากที่สุดในประเทศไทย หากรวมประชากรแฝงที่ไม่ปรากฏในทะเบียนและคนที่ เดินทางมาทำงานในตอนกลางวันด้วยแล้ว คาดว่าจะสูงถึงเกือบเท่าตัวของประชากรที่ปรากฏในทะเบียน เราจึง เรียกกรุงเทพฯ ว่าเป็น <a target='_blank' className='underline' href={staticLink['mega-city'].link}>{staticLink['mega-city'].title}</a> คือมีประชากรตั้งแต่ 10 ล้านคนขึ้นไป
          <br />
          <br />
          อัตราเพิ่มของประชากรกรุงเทพฯ อยู่ระดับเกือบ 1% และเริ่มลดลงในปี 2559 ดังแสดงในแผนภูมิต่อไปนี้
        </p>

        <div>
          {cleanData.length !== 0 ? (
            <Visualization chartWidth={windowDimension.width > 850 ? 650 : windowDimension.width - 100} data={cleanData} />
          ) : (
            <p className='p text-center w-full h-20'>loading...</p>
          )}
        </div>

        <h2 className='h3 mb-2'>แหล่งข้อมูล</h2>
        <ul className='list-disc list-outside pl-5'>
          <li><a target='_blank' className='underline p' href={staticLink['thai-ministry'].link}>{staticLink['thai-ministry'].title}</a></li>
          <li><a target='_blank' className='underline p' href={staticLink['thai-statistic'].link}>{staticLink['thai-ministry'].title}</a></li>
          <li><a target='_blank' className='underline p' href={staticLink['thai-commerce'].link}>{staticLink['thai-ministry'].title}</a></li>
        </ul>
      </main>
    </div>
  );
}

export default App;
