enum ButtonColor {
  Red,
}

export const ButtonColorToClassName = (
  scopedStyle: Readonly<{ [key: string]: string }>,
  color?: ButtonColor,
) => {
  switch (color) {
    case ButtonColor.Red:
      return scopedStyle.red;
    default:
      return "";
  }
};

export default ButtonColor;
