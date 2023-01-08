import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import NavBar from '../components/NavBar'
import CommonLayout from '../components/CommonLayout'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <CommonLayout title="Software Engineer" pageDesc="Home">
      <main className={styles.main}>
        <div className={styles.center}>
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
          {/* <div className={styles.grid}> */}
            <h2 className={inter.className}>
              Danny Maziad
              <span className={styles.separator} />
              Software Engineer
            </h2>
          {/* </div> */}
        </div>
        <div className={styles.center} style={{paddingTop: 0}}>
          <p className={inter.className + ' bio-link'}>
            Engineering Manager @&nbsp;
            <a href="https://www.vicemediagroup.com/"  target="_blank" rel="noopener noreferrer">
              VICE Media Group
            </a>
            .
          </p>
        </div>

        <div className={styles.grid}>
        <a
            href="/about"
            className={styles.card}
          >
            <h2 className={inter.className}>
              About <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              Learn more about me and my journey from lawyer to software engineer.
            </p>
          </a>

          <a
            href="/danny-maziad-resume.pdf"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={inter.className}>
              Resume <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              Get more info on my recent professional experience.
            </p>
          </a>

          <a
            href="https://github.com/dmaziad"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={inter.className}>
              GitHub <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              Check out my GitHub to see publicly available projects.
            </p>
          </a>

          <a
            href="https://www.linkedin.com/in/dmaziad"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={inter.className}>
              LinkedIn <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              Connect with me on LinkedIn.
            </p>
          </a>
        </div>
      </main>
    </CommonLayout>
  )
}
