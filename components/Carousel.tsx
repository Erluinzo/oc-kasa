"use client";

import { useState, type KeyboardEvent } from "react";
import Image from "next/image";
import { BackIcon } from "./Icons";
import styles from "./Carousel.module.css";

type CarouselProps = {
  pictures: string[];
  title: string;
};

/**
 * Photos of a property: a big photo with arrows and up to 4 small photos to pick one.
 * It loops: after the last photo comes the first. With one photo: no arrows, no small photos.
 * Keyboard: Tab to the buttons, or Left / Right arrow keys inside the carousel.
 */
export default function Carousel({ pictures, title }: CarouselProps) {
  const [current, setCurrent] = useState(0);
  const count = pictures.length;

  //+ count then % count: from the first photo "previous" gives the last one, from the last "next" gives the first
  const show = (index: number) => setCurrent((index + count) % count);

  function handleKey(event: KeyboardEvent) {
    if (event.key === "ArrowLeft") show(current - 1);
    if (event.key === "ArrowRight") show(current + 1);
  }

  return (
    <section
      className={`${styles.carousel} ${count === 1 ? styles.single : ""}`}
      aria-roledescription="carrousel"
      aria-label="Photos du logement"
      onKeyDown={handleKey}
    >
      <div className={styles.main}>
        {pictures.map((src, index) => (
          //all photos are stacked, the shown one fades in; the others are hidden from screen readers
          <div
            key={index}
            className={`${styles.slide} ${index === current ? styles.active : ""}`}
            aria-hidden={index !== current}
          >
            <Image
              src={src}
              alt={`${title}, photo ${index + 1}`}
              fill
              sizes={count === 1 ? "(width < 900px) 100vw, 616px" : "(width < 900px) 100vw, 303px"}
              preload={index === 0}
            />
          </div>
        ))}

        {count > 1 && (
          <>
            <button
              type="button"
              className={`${styles.arrow} ${styles.previous}`}
              aria-label="Photo précédente"
              onClick={() => show(current - 1)}
            >
              <BackIcon />
            </button>
            <button
              type="button"
              className={`${styles.arrow} ${styles.next}`}
              aria-label="Photo suivante"
              onClick={() => show(current + 1)}
            >
              <BackIcon />
            </button>
            {/* aria-live: a screen reader says the new photo number after each change */}
            <p className={styles.counter} aria-live="polite">
              <span aria-hidden="true">
                {current + 1}/{count}
              </span>
              <span className="sr-only">
                Photo {current + 1} sur {count}
              </span>
            </p>
          </>
        )}
      </div>

      {count > 1 && (
        <ul className={styles.thumbs}>
          {pictures.slice(1, 5).map((src, i) => {
            const index = i + 1;
            return (
              <li key={index} className={styles.thumb}>
                <button
                  type="button"
                  className={styles.thumbButton}
                  aria-label={`Voir la photo ${index + 1}`}
                  aria-current={index === current}
                  onClick={() => setCurrent(index)}
                >
                  <Image src={src} alt="" fill sizes="(width < 900px) 25vw, 150px" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
