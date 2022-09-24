import { useState } from "react";

import { Select, type SelectOption } from "./Select";

export function App() {
	const [multipleValues, setMultipleValues] = useState<SelectOption[]>(options);
	const [value, setValue] = useState<SelectOption | undefined>(options[0]);

	return (
		<>
			<Select
				onChange={newValues => setMultipleValues(newValues)}
				value={multipleValues}
				options={options}
				multiple
			/>

			<br />

			<Select
				onChange={newValue => setValue(newValue)}
				options={options}
				value={value}
			/>
		</>
	);
}

const options: SelectOption[] = [
	{ label: "First", value: 1 },
	{ label: "Second", value: 2 },
	{ label: "Third", value: 3 },
	{ label: "Fourth", value: 4 },
	{ label: "Fifth", value: 5 },
];

