import { useEffect, useRef, useState, memo } from 'react'
import smartcrop from 'smartcrop'

interface SmartImageProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
}

const SmartImage = memo(({ src, alt, className = '', width = 200, height = 200 }: SmartImageProps) => {
  const imgRef = useRef<HTMLImageElement>(null)
  const [objectPosition, setObjectPosition] = useState('center center')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!src) return

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = src

    img.onload = async () => {
      try {
        const result = await smartcrop.crop(img, { width, height })
        const crop = result.topCrop
        
        // 크롭 영역의 중심점을 계산
        const centerX = crop.x + crop.width / 2
        const centerY = crop.y + crop.height / 2
        
        // 퍼센트로 변환
        const posX = (centerX / img.naturalWidth) * 100
        const posY = (centerY / img.naturalHeight) * 100
        
        setObjectPosition(`${posX}% ${posY}%`)
      } catch (e) {
        console.warn('SmartCrop failed, using center:', e)
        setObjectPosition('center center')
      }
      setLoaded(true)
    }

    img.onerror = () => {
      setObjectPosition('center center')
      setLoaded(true)
    }
  }, [src, width, height])

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      className={`object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`}
      style={{ objectPosition }}
    />
  )
})

SmartImage.displayName = 'SmartImage'

export default SmartImage
