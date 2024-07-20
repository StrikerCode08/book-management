interface Inputlabel {
  type: string;
  name: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  label:string;
  value:string;
  error?:string
}
export default function LabeledInput({
  type,
  name,
  placeholder,
  onChange,
  label,
  value,
  error
}: Inputlabel) {
  return (
    <div className="flex flex-col justify-center">
      <label htmlFor={name}>{label}</label>
      <input
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        required
      />
      {error && <span style={{ color: 'red' }}>{error}</span>}
    </div>
  );
}
