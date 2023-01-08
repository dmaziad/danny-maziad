import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '../../styles/Content.module.css'
import CommonLayout from '../../components/CommonLayout'

const inter = Inter({ subsets: ['latin'] })

export default function About() {
  return (
    <CommonLayout title="About" pageDesc="About">
      <main className={styles.main}>
        <div className={styles.center} style={{ justifyContent: 'center' }}>
          <Image
            className={styles.logo}
            src="/dm-photo.png"
            alt="Danny Maziad"
            width={180}
            height={180}
            priority
          />
        </div>
        <div className={styles.center}>
            <p className={inter.className + ' name'}>
              Hi, I'm Danny Maziad.
            </p>
        </div>
        <div className={styles.center} style={{paddingTop: 0}}>
          <p className={inter.className + ' first-p'}>
            I’m a former lawyer turned software engineer based in New York City.
          </p>
        </div>
        <div className={styles.center} style={{paddingTop: 0}}>
          <p className={inter.className + ' second-p'}>
            Positions I've held:
          </p>
        </div>
        <div className={styles.center} style={{paddingTop: 0}}>
          <ul className={inter.className}>
            <li className="first-li">Engineering Manager</li>
            <li className="second-li">Senior Software Engineer</li>
            <li className="third-li">Frontend Engineer</li>
            <li className="fourth-li">Software Engineer</li>
          </ul>
        </div>
        <div className={styles.center} style={{paddingTop: 0}}>
          <p className={inter.className + ' third-p'}>
            Places I've worked:
          </p>
        </div>
        <div className={styles.center} style={{paddingTop: 0}}>
          <ul className={inter.className}>
            <li className={'fifth-li'}>
              <a href="https://www.vicemediagroup.com/" target="_blank" rel="noopener noreferrer">
              VICE
              </a>
            </li>
            <li className="sixth-li">
              <a href="https://www.justvanilla.com/" target="_blank" rel="noopener noreferrer">
              Vanilla
              </a>
            </li>
            <li className="seventh-li">
              <a href="https://www.hackreactor.com/" target="_blank" rel="noopener noreferrer">
              Hack Reactor
              </a>
            </li>
          </ul>
        </div>
      </main>
    </CommonLayout>
  )
}
