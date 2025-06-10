
import { assets } from '../assets/assets'

const AppDownload = () => {
  return (
    <div
      id='app-download'
      className='bg-[#fff7e6] py-10 px-5 text-center flex flex-col items-center gap-6'
    >
      <p className='text-2xl md:text-3xl font-semibold text-gray-800'>
        For Better Experience Download <br /> <span className="text-orange-500">QuickEats App</span>
      </p>
      <div className='flex gap-6 flex-wrap justify-center'>
        <img
          src={assets.play_store}
          alt="Play Store"
          className='h-12 md:h-14 cursor-pointer transition-transform duration-200 hover:scale-105'
        />
        <img
          src={assets.app_store}
          alt="App Store"
          className='h-12 md:h-14 cursor-pointer transition-transform duration-200 hover:scale-105'
        />
      </div>
    </div>
  )
}

export default AppDownload
