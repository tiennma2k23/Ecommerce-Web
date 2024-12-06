import React from "react";
import styles from "./Header.module.css";
import UserIcon  from "../Assets/sidebar/user.svg";
import NotificationIcon from "../Assets/header/notification.svg";

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.icons}>
        <img src={UserIcon} className={styles.icon} />
        <img src={NotificationIcon} className={styles.icon} />
        
      </div>
    </header>
  );
}

export default Header;
