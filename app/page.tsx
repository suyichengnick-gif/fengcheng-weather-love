'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Cloud, CloudRain, Sun, CloudSun, Heart, Shirt, Umbrella, Utensils, Sparkles, Wind, Droplets, Thermometer, RefreshCw, Copy, Check, CalendarHeart, Coffee, ArrowRight, CloudFog, Snowflake } from 'lucide-react';

type Hour = { time: string; temperature_2m: number; precipitation_probability?: number; precipitation?: number; weather_code: number };
type Weather = { timezone: string; current: { time: string; temperature_2m: number; relative_humidity_2m: number; apparent_temperature: number; is_day: number; precipitation: number; weather_code: number; wind_speed_10m: number }; daily: { time: string[]; weather_code: number[]; temperature_2m_max: number[]; temperature_2m_min: number[]; precipitation_probability_max?: number[]; uv_index_max?: number[]; sunrise: string[]; sunset: string[] }; hourly: { time: string[]; temperature_2m: number[]; precipitation_probability?: number[]; precipitation?: number[]; weather_code: number[] } };
type Dish = { name: string; description: string; main: string; side: string; tag: string; emoji: string };

const dishes: Dish[] = [
  {name:'番茄炒蛋盖饭',description:'酸甜开胃，熟悉的家常味道，忙碌的一天也要好好吃饭。',main:'香喷喷的米饭',side:'清炒时蔬 + 紫菜蛋花汤',tag:'家常暖心',emoji:'🍅'},
  {name:'香菇滑鸡饭',description:'鲜香软嫩的一餐，热乎乎地吃下去，心情也会变好。',main:'香菇滑鸡 + 米饭',side:'蒜蓉生菜 + 冬瓜汤',tag:'暖胃满足',emoji:'🍗'},
  {name:'江西小炒肉',description:'香辣下饭的江西风味，今天也要有滋有味。',main:'小炒肉盖饭',side:'清炒小白菜 + 萝卜汤',tag:'江西风味',emoji:'🌶️'},
  {name:'土豆炖牛肉',description:'软糯土豆配上炖得入味的牛肉，适合想被认真照顾的一天。',main:'土豆炖牛肉 + 米饭',side:'凉拌黄瓜 + 玉米汤',tag:'能量满满',emoji:'🥔'},
  {name:'照烧鸡腿饭',description:'甜咸适口的鸡腿肉，配上蔬菜，一份简单又满足的午餐。',main:'照烧鸡腿 + 米饭',side:'西兰花 + 味噌汤',tag:'元气午餐',emoji:'🍱'},
  {name:'青椒肉丝面',description:'热气腾腾的一碗面，吃完就有力气继续面对今天。',main:'青椒肉丝面',side:'凉拌海带丝 + 水果',tag:'快速方便',emoji:'🍜'},
  {name:'香煎三文鱼饭',description:'清爽又有营养，给认真生活的自己补充一点能量。',main:'香煎三文鱼 + 米饭',side:'烤南瓜 + 蔬菜沙拉',tag:'清爽均衡',emoji:'🐟'},
  {name:'红烧排骨饭',description:'酱香浓郁的家常菜，今天的幸福感从好好吃饭开始。',main:'红烧排骨 + 米饭',side:'蒜蓉青菜 + 番茄汤',tag:'家常经典',emoji:'🍖'},
  {name:'虾仁滑蛋饭',description:'嫩滑鸡蛋配鲜甜虾仁，口感轻盈，吃起来也很满足。',main:'虾仁滑蛋 + 米饭',side:'清炒西兰花 + 菌菇汤',tag:'鲜香清爽',emoji:'🍤'},
  {name:'香辣鸡丁盖饭',description:'一点点香辣，一大份满足，今天也要好好犒劳自己。',main:'香辣鸡丁 + 米饭',side:'拍黄瓜 + 冬瓜汤',tag:'微辣开胃',emoji:'🍚'},
  {name:'扬州炒饭',description:'有蛋有菜有米饭，方便又丰富，适合不想纠结的时候。',main:'什锦扬州炒饭',side:'紫菜汤 + 一份水果',tag:'省心选择',emoji:'🥚'},
  {name:'鱼香肉丝饭',description:'酸甜微辣很下饭，记得慢慢吃，不要因为忙就敷衍午餐。',main:'鱼香肉丝 + 米饭',side:'清炒油麦菜 + 蛋花汤',tag:'酸甜下饭',emoji:'🥢'},
  {name:'日式咖喱鸡饭',description:'浓郁咖喱配软糯土豆，像一份温暖的小小拥抱。',main:'咖喱鸡肉 + 米饭',side:'蔬菜沙拉 + 玉米',tag:'温柔治愈',emoji:'🍛'},
  {name:'馄饨配小菜',description:'一碗热汤馄饨，简单轻松，也可以是很幸福的一餐。',main:'鲜肉馄饨',side:'凉拌黄瓜 + 橙子',tag:'清淡暖胃',emoji:'🥣'},
  {name:'青菜香菇鸡蛋面',description:'清清爽爽的一碗面，暖胃不复杂，适合舒服地过中午。',main:'香菇青菜鸡蛋面',side:'卤蛋 + 一份水果',tag:'清淡简单',emoji:'🍜'},
  {name:'可乐鸡翅饭',description:'甜甜咸咸的熟悉味道，偶尔也要吃一点喜欢的。',main:'可乐鸡翅 + 米饭',side:'清炒时蔬 + 海带汤',tag:'快乐加餐',emoji:'🍗'},
  {name:'肉末蒸蛋饭',description:'嫩滑蒸蛋和肉末搭配，柔软的一餐也能带来好心情。',main:'肉末蒸蛋 + 米饭',side:'清炒菠菜 + 菌菇汤',tag:'软嫩暖心',emoji:'🥚'},
  {name:'香煎豆腐饭',description:'外香里嫩的豆腐配上蔬菜，轻松吃出舒服的满足感。',main:'香煎豆腐 + 米饭',side:'蒜蓉青菜 + 番茄汤',tag:'植物蛋白',emoji:'🌱'},
  {name:'牛肉番茄意面',description:'酸甜番茄搭配牛肉，换个口味，让普通的一天有点新鲜感。',main:'牛肉番茄意面',side:'蔬菜沙拉 + 温水',tag:'西式风味',emoji:'🍝'},
  {name:'扬州狮子头饭',description:'软嫩入味的家常菜，吃一顿认真准备的午饭。',main:'红烧狮子头 + 米饭',side:'清炒上海青 + 菌菇汤',tag:'家常满足',emoji:'🍲'},
  {name:'江西米粉',description:'嗦一碗香香的江西米粉，熟悉的家乡味总是很治愈。',main:'江西炒米粉',side:'卤蛋 + 清爽小菜',tag:'江西味道',emoji:'🍜'},
  {name:'香干炒肉',description:'豆香和肉香搭在一起，配一碗米饭就是踏实的幸福。',main:'香干炒肉 + 米饭',side:'清炒生菜 + 紫菜汤',tag:'下饭家常',emoji:'🥢'},
  {name:'清蒸鲈鱼饭',description:'清淡鲜美的一餐，给身体一点轻松，也给自己一点照顾。',main:'清蒸鲈鱼 + 米饭',side:'蒜蓉西兰花 + 冬瓜汤',tag:'清淡鲜美',emoji:'🐟'},
  {name:'鸡排饭',description:'酥香鸡排配热米饭，今天也要有一点让自己开心的小奖励。',main:'香煎鸡排 + 米饭',side:'玉米粒 + 蔬菜沙拉',tag:'快乐能量',emoji:'🍗'},
  {name:'香菇肉末拌面',description:'酱香浓郁又省时，适合想快点吃好然后好好休息的日子。',main:'香菇肉末拌面',side:'烫青菜 + 蛋花汤',tag:'快手午餐',emoji:'🍜'},
  {name:'莲藕排骨汤配饭',description:'温润的一碗汤，配上米饭和青菜，平凡但很用心。',main:'莲藕排骨汤 + 米饭',side:'清炒时蔬',tag:'暖汤滋养',emoji:'🥣'},
  {name:'青椒炒蛋饭',description:'简单的家常组合，少一点纠结，多一点认真吃饭的快乐。',main:'青椒炒蛋 + 米饭',side:'凉拌木耳 + 紫菜汤',tag:'简单家常',emoji:'🫑'},
  {name:'虾仁炒乌冬',description:'软弹乌冬加鲜虾和蔬菜，给今天换个轻松的口味。',main:'虾仁蔬菜炒乌冬',side:'水果 + 温水',tag:'鲜香面食',emoji:'🍤'},
  {name:'家常红烧茄子',description:'软糯入味的茄子配米饭，家常菜也有让人惦记的味道。',main:'红烧茄子 + 米饭',side:'香煎鸡蛋 + 青菜汤',tag:'下饭蔬菜',emoji:'🍆'},
  {name:'鸡丝凉面',description:'清爽的鸡丝凉面，适合天气暖和时吃得轻松一点。',main:'鸡丝凉面',side:'凉拌黄瓜 + 番茄',tag:'清爽开胃',emoji:'🥒'},
];

const loveLines = [
  {type:'sun', text:'天气预报只能告诉你今天冷不冷，但我想告诉你，无论今天是什么天气，都有人在认真地想你。'},
  {type:'rain', text:'如果今天下雨了，就把伞打好、步子放慢。淋湿的事情交给雨，开心的事情留给你。'},
  {type:'cold', text:'降温啦，记得穿暖一点。不能时时刻刻把外套披在你身上，但我会一直惦记你有没有照顾好自己。'},
  {type:'hot', text:'今天太阳可能有点热烈，但你不用努力发光呀，你只要做自己，就已经很好了。'},
  {type:'cloud', text:'普通的一天也值得被认真对待，就像普通的你，也一直是我很珍惜的人。'},
  {type:'any', text:'希望你今天遇见的每一件小事，都能轻轻地对你说一句：生活其实也挺可爱的。'},
  {type:'any', text:'记得按时吃饭，记得喝水，也记得在忙碌的生活里，给自己留一点点开心。'},
  {type:'any', text:'我没有魔法，不能替你赶走所有烦恼，但我希望你知道，你不必每一天都很厉害。'},
  {type:'any', text:'愿你今天走路有风，抬头有光，低头有喜欢的小事，心里还有一点甜。'},
  {type:'any', text:'如果今天有点累，就把目标调小一点。好好吃饭、平安回家，也已经很棒啦。'},
  {type:'rain', text:'雨天适合听歌，也适合被惦记。伞记得带好，我的想念就不怕淋雨啦。'},
  {type:'sun', text:'愿今天的阳光刚刚好，风也温柔，而你不需要赶路，只需要慢慢开心。'},
  {type:'any', text:'今天也请对自己好一点。毕竟你是那个我希望被世界温柔以待的人。'},
  {type:'cold', text:'天气会变冷，但喜欢你的心情不用加衣服，因为它一直都暖暖的。'},
  {type:'hot', text:'热的时候要记得喝水，累的时候要记得休息。你不是小太阳，也可以偶尔躲进阴凉里。'},
];

function weatherLabel(code: number) {
  if (code === 0) return '晴朗';
  if ([1,2].includes(code)) return '晴间多云';
  if (code === 3) return '阴天';
  if ([45,48].includes(code)) return '有雾';
  if ([51,53,55,56,57].includes(code)) return '毛毛雨';
  if ([61,63,65,66,67,80,81,82].includes(code)) return '有雨';
  if ([71,73,75,77,85,86].includes(code)) return '有雪';
  if ([95,96,99].includes(code)) return '雷雨';
  return '多云';
}
function WeatherIcon({code, size=32}: {code:number; size?:number}) {
  if (code === 0) return <Sun size={size} strokeWidth={1.6}/>;
  if ([1,2,3].includes(code)) return <CloudSun size={size} strokeWidth={1.6}/>;
  if ([45,48].includes(code)) return <CloudFog size={size} strokeWidth={1.6}/>;
  if ([71,73,75,77,85,86].includes(code)) return <Snowflake size={size} strokeWidth={1.6}/>;
  if ([51,53,55,56,57,61,63,65,66,67,80,81,82,95,96,99].includes(code)) return <CloudRain size={size} strokeWidth={1.6}/>;
  return <Cloud size={size} strokeWidth={1.6}/>;
}
function hourText(iso: string) { return iso.split('T')[1]?.slice(0,5) ?? iso; }
function getClothing(max:number,min:number,rain:number,wind:number) {
  let top='', bottom='', outer='', shoes='', note='';
  if (max >= 32) { top='透气棉质短袖 / 清凉薄上衣'; bottom='轻薄长裤或舒适半身裙'; outer='室内空调较冷时带一件薄开衫'; shoes='透气运动鞋或舒适凉鞋'; note='天气偏热，注意防晒和补水，尽量避开正午长时间暴晒。'; }
  else if (max >= 26) { top='纯棉短袖 / 轻薄衬衫'; bottom='直筒牛仔裤或轻薄半身裙'; outer='可选：薄款防晒外套'; shoes='轻便运动鞋或休闲鞋'; note='中午可能偏暖，选择透气面料，出门前看看紫外线情况。'; }
  else if (max >= 20) { top='长袖T恤 / 薄款针织衫'; bottom='牛仔裤或长裙'; outer='轻薄开衫或休闲外套'; shoes='舒适运动鞋'; note='早晚温差大时可以灵活增减外套。'; }
  else if (max >= 14) { top='长袖打底衫 / 薄针织衫'; bottom='长裤'; outer='针织开衫或中等厚度夹克'; shoes='包脚休闲鞋'; note='早晚会比较凉，出门时带上外套更稳妥。'; }
  else { top='保暖打底衫 / 毛衣'; bottom='厚长裤'; outer='保暖外套或羽绒服，按实际体感调整'; shoes='包脚鞋或保暖运动鞋'; note='气温偏低，注意颈部和手部保暖。'; }
  if (rain >= 40) { note += ' 降雨概率较高，记得带伞；鞋子尽量选择防滑耐湿款。'; }
  if (wind >= 25) note += ' 风力较大，建议选择防风外套。';
  if (max-min >= 10) note += ' 昼夜温差明显，早晚和中午分层穿搭更舒服。';
  return {top,bottom,outer,shoes,note};
}
function localDateKey() {
  const parts = new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
  const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}
function dateLabel(key = localDateKey()) {
  // Parse at noon in Shanghai so the label cannot fall on the previous day in another browser timezone.
  return new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',year:'numeric',month:'long',day:'numeric',weekday:'long'}).format(new Date(`${key}T12:00:00+08:00`));
}

export default function Home() {
  const [weather,setWeather] = useState<Weather|null>(null);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState('');
  const [updatedAt,setUpdatedAt] = useState('');
  const [dishIndex,setDishIndex] = useState(0);
  const [loveIndex,setLoveIndex] = useState(0);
  const [saved,setSaved] = useState(false);
  const [copied,setCopied] = useState(false);
  const [checked,setChecked] = useState([false,false,false]);

  const loadWeather = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const url = 'https://api.open-meteo.com/v1/forecast?latitude=28.159&longitude=115.786&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,precipitation_probability,precipitation,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max,sunrise,sunset&timezone=Asia%2FShanghai&forecast_days=3';
      const res = await fetch(url,{cache:'no-store'});
      if (!res.ok) throw new Error('天气服务暂时没有响应');
      const data: Weather = await res.json();
      if (data.timezone !== 'Asia/Shanghai' || !data.current?.time || !data.daily?.time?.length || !data.hourly?.time?.length) throw new Error('天气数据暂时不完整，或时区不是中国标准时间');
      if (data.daily.time.length !== data.daily.temperature_2m_max.length || data.hourly.time.length !== data.hourly.temperature_2m.length) throw new Error('天气服务返回的数据长度不一致');
      setWeather(data); setUpdatedAt(new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',hour:'2-digit',minute:'2-digit'}).format(new Date()));
    } catch(e) { setError(e instanceof Error ? e.message : '天气加载失败，请稍后再试。'); }
    finally { setLoading(false); }
  },[]);

  useEffect(() => {
    void loadWeather();
    const key = localDateKey();
    try {
      const savedLove = localStorage.getItem(`love-weather-${key}`);
      const savedDish = Number(localStorage.getItem(`lunch-weather-${key}`));
      const savedTasks = localStorage.getItem(`tasks-weather-${key}`);
      setLoveIndex(savedLove ? Math.max(0, Number(savedLove) % loveLines.length) : 0);
      setSaved(localStorage.getItem(`favorite-weather-${key}`) === 'true');
      if (Number.isInteger(savedDish) && savedDish >= 0 && savedDish < dishes.length) setDishIndex(savedDish);
      if (savedTasks) {
        const tasks: unknown = JSON.parse(savedTasks);
        if (Array.isArray(tasks) && tasks.length === 3 && tasks.every(value => typeof value === 'boolean')) setChecked(tasks);
      }
    } catch { /* Local storage can be disabled by browser privacy settings. */ }
  },[loadWeather]);

  const today = useMemo(() => {
    if (!weather) return null;
    const key = localDateKey();
    const apiCurrentKey = weather.current.time?.slice(0,10);
    let index = weather.daily.time.findIndex(t => t === key);
    // Open-Meteo can briefly lag across midnight; keep the displayed date aligned with its local-time forecast.
    if (index < 0) index = weather.daily.time.findIndex(t => t === apiCurrentKey);
    if (index < 0) index = 0;
    const hourly: Hour[] = weather.hourly.time.map((time,i)=>({time,temperature_2m:weather!.hourly.temperature_2m[i],precipitation_probability:weather!.hourly.precipitation_probability?.[i] ?? 0,precipitation:weather!.hourly.precipitation?.[i] ?? 0,weather_code:weather!.hourly.weather_code[i]}));
    const currentTime = apiCurrentKey === weather.daily.time[index]
      ? weather.current.time.slice(0,13)
      : `${weather.daily.time[index]}T${new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Shanghai',hour:'2-digit',hour12:false}).format(new Date())}`;
    const currentHour = Number(currentTime.slice(11,13));
    const nextHours = hourly.filter(h=>h.time.slice(0,13) >= currentTime).slice(0,12);
    const riskHours = nextHours.filter(h=>h.time.startsWith(weather.daily.time[index]) && ((h.precipitation_probability ?? 0)>=40 || (h.precipitation ?? 0)>=0.2));
    const rainWindows: {start:string;end:string;prob:number}[]=[];
    riskHours.forEach(h=>{
      const time=hourText(h.time), hour=Number(time.slice(0,2));
      const last=rainWindows[rainWindows.length-1];
      const end = `${String((hour+1)%24).padStart(2,'0')}:00`;
      if(last && Number(last.end.slice(0,2))===hour){last.end=end;last.prob=Math.max(last.prob,h.precipitation_probability??0);}
      else rainWindows.push({start:time,end,prob:h.precipitation_probability??0});
    });
    const max=weather.daily.temperature_2m_max[index], min=weather.daily.temperature_2m_min[index], rain=weather.daily.precipitation_probability_max?.[index]??0, wind=weather.current.wind_speed_10m;
    const dateKey=weather.daily.time[index];
    const clothingRain = rainWindows.length ? Math.max(rain,40) : rain;
    return {index,dateKey,code:weather.daily.weather_code[index],max,min,rain,uv:weather.daily.uv_index_max?.[index],sunrise:weather.daily.sunrise[index],sunset:weather.daily.sunset[index],hourly,currentHour,remainingHours:nextHours.slice(0,12),rainWindows,clothing:getClothing(max,min,clothingRain,wind)};
  },[weather]);

  const currentDish = dishes[dishIndex];
  const currentLove = useMemo(()=>{
    if (!today) return loveLines[loveIndex % loveLines.length];
    const type = today.rain>=40 || today.rainWindows.length>0 || [51,53,55,56,57,61,63,65,66,67,80,81,82,95,96,99].includes(today.code) ? 'rain' : today.max>=32 ? 'hot' : today.min<12 ? 'cold' : today.code===0 ? 'sun' : 'cloud';
    const matches=loveLines.filter(l=>l.type===type || l.type==='any');
    return matches[loveIndex % matches.length];
  },[today,loveIndex]);

  const shuffleDish = () => { let n=Math.floor(Math.random()*dishes.length); if(n===dishIndex) n=(n+1)%dishes.length; setDishIndex(n); try{localStorage.setItem(`lunch-weather-${localDateKey()}`,String(n));}catch{} };
  const shuffleLove = () => { const next=(loveIndex+1)%loveLines.length; setLoveIndex(next); try{localStorage.setItem(`love-weather-${localDateKey()}`,String(next));}catch{} setSaved(false); try{localStorage.setItem(`favorite-weather-${localDateKey()}`,'false');}catch{} };
  const toggleSaved = () => { const next=!saved; setSaved(next); try{localStorage.setItem(`favorite-weather-${localDateKey()}`,String(next));}catch{} };
  const toggleTask = (index:number) => setChecked(old=>{ const next=old.map((value,j)=>index===j?!value:value); try{localStorage.setItem(`tasks-weather-${localDateKey()}`,JSON.stringify(next));}catch{} return next; });
  const copyDay = async () => {
    const text = `给你的每日天气情书 ♡\n${dateLabel(today?.dateKey)} · 江西丰城\n${today ? `${weatherLabel(today.code)}，${Math.round(today.min)}°–${Math.round(today.max)}°C\n穿搭：${today.clothing.top}；${today.clothing.bottom}；${today.clothing.outer}\n降雨：${today.rainWindows.length ? today.rainWindows.map(r=>`${r.start}–${r.end}`).join('、') : '暂未发现明显降雨时段（预报可能变化）'}` : '天气正在加载中'}\n午餐：${currentDish.name}\n${currentLove.text}`;
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(()=>setCopied(false),1800); } catch { setError('复制失败，请检查浏览器权限。'); }
  };

  return <main className="page-shell">
    <div className="ambient ambient-one"/><div className="ambient ambient-two"/>
    <header className="topbar"><a className="brand" href="#top"><span className="brand-mark"><Heart size={17} fill="currentColor"/></span><span>给你的每日天气情书</span></a><button className="icon-button" aria-label="刷新天气" onClick={()=>void loadWeather()}><RefreshCw size={17} className={loading?'spin':''}/></button></header>
    <section className="hero" id="top">
      <div className="hero-copy"><span className="eyebrow"><Sparkles size={14}/> A LITTLE GIFT FOR YOU</span><h1>宝贝，今天也要<br/><em>开心呀。</em></h1><p className="hero-sub">{dateLabel(today?.dateKey)}</p><p className="hero-location"><span className="location-dot"/> 江西 · 丰城市 <span className="tiny-heart">♡</span></p></div>
      <div className="hero-art" aria-hidden="true"><div className="sun-orb"/><div className="cloud cloud-a"/><div className="cloud cloud-b"/><span className="sparkle s1">✦</span><span className="sparkle s2">✧</span><span className="floating-heart">♥</span><span className="art-caption">have a lovely day</span></div>
    </section>
    {error && <div className="notice error"><span>{error}</span><button onClick={()=>void loadWeather()}>重试</button></div>}
    <section className="weather-card card">
      <div className="section-kicker">TODAY'S WEATHER <span className="live-dot"/> <span className="live-label">丰城实时预报</span></div>
      {loading&&!weather ? <div className="loading"><span className="loader"/>正在把丰城的天气送过来…</div> : today&&weather ? <>
        <div className="weather-main"><div className="weather-condition"><div className="weather-symbol"><WeatherIcon code={weather.current.weather_code} size={43}/></div><div><h2>{weatherLabel(weather.current.weather_code)}</h2><p>现在 {Math.round(weather.current.temperature_2m)}°C · 体感 {Math.round(weather.current.apparent_temperature)}°C</p></div></div><div className="temperature"><strong>{Math.round(today.max)}°</strong><span>/ {Math.round(today.min)}°</span></div></div>
        <p className="weather-note">{today.max>=30?'今天可能有点热，记得防晒和补水。':today.min<12?'今天有些凉，出门记得添衣。':'愿今天的风和温度，都刚好让你舒服。'}</p>
        <div className="weather-stats"><div className="stat"><span className="stat-icon"><Thermometer size={17}/></span><span className="stat-label">最高 / 最低</span><b>{Math.round(today.max)}° / {Math.round(today.min)}°C</b></div><div className="stat"><span className="stat-icon"><CloudRain size={17}/></span><span className="stat-label">今日降雨概率</span><b>{today.rain}%</b></div><div className="stat"><span className="stat-icon"><Droplets size={17}/></span><span className="stat-label">当前湿度</span><b>{weather.current.relative_humidity_2m}%</b></div><div className="stat"><span className="stat-icon"><Wind size={17}/></span><span className="stat-label">当前风速</span><b>{Math.round(weather.current.wind_speed_10m)} km/h</b></div></div>
        <div className="rain-alert"><div className="rain-alert-icon"><Umbrella size={19}/></div><div className="rain-alert-copy"><b>{today.rainWindows.length?'今天可能会下雨，出门带伞哦':'降雨时间提醒'}</b><p>{today.rainWindows.length ? today.rainWindows.slice(0,3).map(r=>`${r.start}–${r.end}`).join('、')+' 可能有雨' : '根据当前逐小时预报，暂未发现明显降雨时段；天气可能变化。'}</p></div><span className="rain-chance">{today.rain}%</span></div>
        <div className="hourly-heading"><span>接下来天气</span><span>逐小时预报</span></div><div className="hourly-list">{today.remainingHours.slice(0,7).map((h,i)=><div className="hour-item" key={h.time}><span>{h.time.slice(0,13)===weather.current.time.slice(0,13)?'现在':hourText(h.time)}</span><WeatherIcon code={h.weather_code} size={20}/><b>{Math.round(h.temperature_2m)}°</b><small><CloudRain size={11}/>{h.precipitation_probability??0}%</small></div>)}</div>
        <div className="weather-foot"><span>日出 {hourText(today.sunrise)} · 日落 {hourText(today.sunset)}</span><span>{today.uv!==undefined?`紫外线指数 ${Math.round(today.uv)}`:'注意天气变化'}</span></div>
        <p className="updated">天气来源 Open-Meteo · {updatedAt?`页面更新于 ${updatedAt}`:'正在获取数据'} · 预报仅供参考</p>
      </> : <div className="loading">暂时无法获取天气，请稍后重试。</div>}
    </section>

    <section className="section-block outfit-section"><div className="section-title-row"><div><span className="section-eyebrow">A LITTLE STYLE GUIDE</span><h2><span className="title-icon pink"><Shirt size={20}/></span>今天这样穿 <span className="title-heart">♡</span></h2><p>天气会变，照顾好自己这件事不变。</p></div><span className="pill">OOTD</span></div>
      <div className="outfit-card card"><div className="outfit-illustration"><div className="outfit-sun">✦</div><div className="hanger"><div className="hanger-hook"/><div className="hanger-top"/><div className="shirt-shape"><div className="shirt-neck"/><div className="shirt-seam"/></div><div className="pants-shape"><div/><div/></div></div><div className="outfit-sticker">today's<br/>look ♡</div><span className="outfit-flower">✿</span></div><div className="outfit-details"><span className="style-tag">{today&&today.max>=30?'清凉透气系':today&&today.max<15?'温暖包裹系':'温柔日常系'}</span><h3>舒服自在，也要漂漂亮亮</h3><div className="outfit-row"><span>上衣</span><b>{today?.clothing.top??'轻薄舒适的上衣'}</b></div><div className="outfit-row"><span>下装</span><b>{today?.clothing.bottom??'舒适长裤或半身裙'}</b></div><div className="outfit-row"><span>外套</span><b>{today?.clothing.outer??'根据早晚温度灵活搭配'}</b></div><div className="outfit-row"><span>鞋子</span><b>{today?.clothing.shoes??'舒适好走的鞋子'}</b></div><div className="tip-box"><Sparkles size={16}/><p>{today?.clothing.note??'出门前再看一眼天气，按实际体感增减衣物。'}</p></div><div className="umbrella-mini"><Umbrella size={16}/><span>{today&&(today.rain>=40||today.rainWindows.length>0)?'今日建议带伞，路面湿滑时注意安全。':'也可以在包里放一把小伞，有备无患。'}</span></div></div></div>
    </section>

    <section className="section-block lunch-section"><div className="section-title-row"><div><span className="section-eyebrow">LUNCH SURPRISE</span><h2><span className="title-icon peach"><Utensils size={20}/></span>中午吃点什么？</h2><p>午餐盲盒开启！今天也要好好吃饭。</p></div><span className="pill pill-peach">每日一餐</span></div>
      <div className="lunch-card card"><div className="food-art"><div className="food-rays">✧　✦</div><div className="food-plate"><div className="food-rice">{currentDish.emoji}</div><div className="food-leaf">✿</div><div className="food-tomato">●</div></div><span className="food-heart">♡</span><span className="food-caption">made with love</span></div><div className="lunch-info"><span className="food-tag">{currentDish.tag}</span><h3>{currentDish.name}</h3><p>{currentDish.description}</p><div className="meal-line"><span>🍚 主食</span><b>{currentDish.main}</b></div><div className="meal-line"><span>🥬 搭配</span><b>{currentDish.side}</b></div><button className="primary-button" onClick={shuffleDish}><RefreshCw size={16}/> 再抽一道午餐 <ArrowRight size={15}/></button><p className="lunch-footnote">随机推荐仅供灵感参考，记得按自己的口味选择哦。</p></div></div>
    </section>

    <section className="love-card"><div className="love-decoration decor-left">✿</div><div className="love-decoration decor-right">♡</div><div className="love-topline"><span>✉</span> A LETTER JUST FOR YOU <span>✧</span></div><div className="love-heart"><Heart size={23} fill="currentColor"/></div><h2>今日份的小情话</h2><p className="love-text">“{currentLove.text}”</p><div className="love-signature">—— 想一直照顾你的那个人 ♡</div><div className="love-actions"><button className={`love-button ${saved?'is-saved':''}`} aria-pressed={saved} onClick={toggleSaved}><Heart size={15} fill={saved?'currentColor':'none'}/>{saved?'已收藏这份心意':'收藏这句情话'}</button><button className="love-button" onClick={shuffleLove}><RefreshCw size={15}/> 再读一句</button></div></section>

    <section className="little-tasks card"><div className="tasks-heading"><div><span className="section-eyebrow">LITTLE THINGS MATTER</span><h2><span className="title-icon lavender"><Heart size={19}/></span>今天也要照顾好自己</h2></div><span className="task-count">{checked.filter(Boolean).length}/3 完成</span></div><div className="progress-track"><div className="progress-fill" style={{width:`${checked.filter(Boolean).length/3*100}%`}}/></div><div className="task-list">{['好好吃午饭，不要饿着肚子','记得喝水，忙累了就休息一下','平平安安回家，今天也要开心'].map((t,i)=><button key={t} type="button" role="checkbox" aria-checked={checked[i]} className={`task-item ${checked[i]?'task-done':''}`} onClick={()=>toggleTask(i)}><span className="task-check">{checked[i]&&<Check size={13}/>}</span><span>{t}</span><span className="task-tiny-heart">♡</span></button>)}</div></section>

    <div className="bottom-actions"><button className="copy-button" onClick={()=>void copyDay()}>{copied?<Check size={16}/>:<Copy size={16}/>} {copied?'已复制今天的小情报':'把今天的天气和情话带走'}</button></div>
    <footer className="footer"><div className="footer-heart"><Heart size={15} fill="currentColor"/></div><p>今天也要好好照顾自己哦。</p><span>made with love, just for you ♡</span><small>天气数据来自 Open-Meteo · 预报可能存在误差</small></footer>
  </main>;
}
