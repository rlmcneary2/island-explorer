import React, { useCallback } from "react";
import { FormattedMessage } from "react-intl";

export function Checkbox({ id, onChange, ...props }: Props) {
  const handleChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    evt => onChange(evt.target.checked),
    [onChange]
  );

  return (
    <div className="checkbox">
      <input id={id} onChange={handleChange} type="checkbox" {...props} />
      <label htmlFor={id}>
        <FormattedMessage id={id} />
      </label>
    </div>
  );
}

interface Props
  extends Omit<
    React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >,
    "id" | "onChange" | "type"
  > {
  id: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >["id"];
  onChange: (checked: boolean) => void;
}
