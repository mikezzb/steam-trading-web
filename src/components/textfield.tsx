import clsx from "clsx";
import { FC } from "react";
import styles from "@/styles/components/textfield.module.scss";

type Tag = "input" | "textarea";

type TextFieldProps = {
  error?: string;
  Tag?: Tag;
  value: string;
  type?: string;
  inputRef?: React.RefObject<HTMLInputElement | HTMLTextAreaElement>;
  label?: string;
  disabled?: boolean;
};

const TextField: FC<
  React.HTMLAttributes<HTMLInputElement | HTMLTextAreaElement> & TextFieldProps
> = ({
  value,
  onChange,
  placeholder,
  error,
  defaultValue,
  type,
  Tag,
  inputRef,
  label,
  onBlur,
  onFocus,
  disabled,
  className,
}) => {
  const TagName = Tag || "input";
  return (
    <>
      {Boolean(label) && <span className={clsx("label")}>{label}</span>}
      <TagName
        ref={inputRef as any}
        className={clsx("input-container", className)}
        placeholder={placeholder}
        defaultValue={defaultValue}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        disabled={disabled}
      />
      {Boolean(error) && <div className={styles.errorLabel}>{error}</div>}
    </>
  );
};

export default TextField;
