/**
 * Anglická vetva webu. Layout stránky je spoločný s koreňovým — mení sa len
 * jazyk dokumentu, aby čítačky aj prehliadač vedeli, v akom jazyku je obsah.
 * Skript beží počas parsovania HTML, teda ešte pred prvým vykreslením.
 */
export default function EnLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: 'document.documentElement.lang="en"' }} />
      {children}
    </>
  );
}
