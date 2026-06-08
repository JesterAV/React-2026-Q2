import { createContext, useContext } from 'react';

interface FormContextType {
  onClose: () => void;
}

const FormContext = createContext<FormContextType | null>(null);

export const FormProvider = FormContext.Provider;
export const useFormContext = () => {
  const context = useContext(FormContext);

  if (!context)
    throw new Error('useFormContext must be used with FormProvider');

  return context;
};
