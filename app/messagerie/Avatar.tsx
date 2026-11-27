import Image from "next/image";
import styles from "./messages.module.css";

type AvatarProps = {
  name: string;
  picture: string | null;
  //large: 45px in the conversation list, small: 28px next to a message (Figma)
  size: "large" | "small";
};

/**
 * Photo of a user, or the first letter of the name when there is no photo.
 * Decorative (empty alt / aria-hidden): the name is always written next to it.
 */
export default function Avatar({ name, picture, size }: AvatarProps) {
  const className = `${styles.avatar} ${size === "large" ? styles.large : styles.small}`;
  if (picture) {
    const px = size === "large" ? 45 : 28;
    return <Image src={picture} alt="" width={px} height={px} className={className} />;
  }
  return (
    <span className={className} aria-hidden="true">
      {name.charAt(0).toUpperCase()}
    </span>
  );
}
