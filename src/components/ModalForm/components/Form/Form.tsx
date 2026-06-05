import './Form.scss';

import FormField from '../FormField/InputFormFiled';
import SelectFormField from '../FormField/SelectFormFiled';

export default function Form() {
  return (
    <div className="form">
      <FormField type="text" labelText="name" placeholder="enter name" />
      <FormField type="number" labelText="age" placeholder="enter your age" />
      <FormField type="email" labelText="email" placeholder="enter email" />
      <SelectFormField
        labelText="gender"
        placeholder="Select gender"
        options={['Male', 'Female']}
      />
    </div>
  );
}
