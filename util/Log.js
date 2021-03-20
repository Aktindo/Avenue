const chalk = require("chalk");

module.exports = class Log {
  /**
   *
   * @param {String} src
   */
  static getSource(src) {
    return src ? src.toUpperCase() : "OTHER";
  }

  /**
   *
   * @param {*} message
   * @param {String} src
   */
  static info(message, src) {
    console.log(
      `[${this.toHHMMSS(new Date())}] ${chalk.green("INFO")} [${this.getSource(
        src
      )}] ${message}`
    );
  }

  /**
   *
   * @param {*} message
   * @param {String} src
   */
  static warning(message, src) {
    console.log(
      `[${this.toHHMMSS(new Date())}] ${chalk.yellow(
        "WARNING"
      )} [${this.getSource(src)}] ${message}`
    );
  }

  /**
   *
   * @param {*} message
   * @param {String} src
   * @param {*} error
   */
  static error(message, src, error) {
    console.log(
      `[${this.toHHMMSS(new Date())}] ${chalk.red("ERROR")} [${this.getSource(
        src
      )}] ${message}\n> ${error}`
    );
  }

  /**
   *
   * @param {Date} time
   * @returns String
   */

  static toHHMMSS(time) {
    let hours = time.getHours().toString().padStart(2, "0");
    const ampm = time.getHours() >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutes = time.getMinutes().toString().padStart(2, "0");
    const seconds = time.getSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds} ${ampm}`;
  }
};
