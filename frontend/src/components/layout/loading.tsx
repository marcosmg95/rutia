import './style.css';

export default function Loading() {
  return (
    <div className="grow mx-auto flex flex-col items-center loading">
      <div className="lds-grid"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
      <span className="text-sm mt-5 font-semibold text">
        rutIA està pensant...
      </span>
    </div>
  )
}