import React from 'react';
import { FieldRenderProps } from 'react-final-form';
import { DateTimePicker } from 'react-widgets';
import { Form, FormFieldProps, Label } from 'semantic-ui-react';

interface IProps extends FieldRenderProps<Date, HTMLInputElement>, FormFieldProps { }

const DateInput: React.FC<IProps> = ({
    name,
    input,
    width,
    placeholder,
    date=false,
    time=false,
    meta: { touched, error },
    ...rest }) => {
    //console.log('input.value: ', input.value);
    return (
        <Form.Field error={touched && !!error}>
            <DateTimePicker
                name={name}
                date={date}
                time={time}
                placeholder={placeholder}
                value={input.value! || null}
                onChange={input.onChange}
                onBlur={input.onBlur}
                onKeyDown={(e) => e.preventDefault()}
                //{...rest}
            />
            {touched && error &&
                <Label basic color='red'>{error}</Label>}
        </Form.Field>
    )
}

export default DateInput
