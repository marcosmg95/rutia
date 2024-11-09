import './style.css';
export default function Loading() {
  return (
    <div className="grow mx-auto flex flex-col items-center loading">
      <div className="lds-grid"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
      <span className="text-sm mt-3 font-semibold">
        rutIA està pensant...
      </span>
    </div>
  )
}