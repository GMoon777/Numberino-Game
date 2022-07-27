

import { toPng } from 'html-to-image';

export default function scoreDownloader(ref,name) {
      if (ref.current === null) {
        return
      }
  
      toPng(ref.current, { cacheBust: true, })
        .then((dataUrl) => {
          const link = document.createElement('a')
          link.download = name 
          link.href = dataUrl
          link.click()
        })
        .catch((err) => {
          console.log(err)
        })
    }