import { useState, useEffect, useRef } from "react";

import styles from "./styles/select.module.css";

export function Select({ onChange, multiple, options, value }: SelectProps) {
	const [highlightedIndex, setHighlightedIndex] = useState(0);
	const containerRef = useRef<HTMLDivElement>(null);
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		if (isOpen) setHighlightedIndex(0); // If is opening
	}, [isOpen]);

	useEffect(() => {
		function handler(e: KeyboardEvent) {
			if (e.target !== containerRef.current) return;

			switch (e.code) {
				case "Enter":
				case "Space":
					setIsOpen(prev => !prev);
					if (isOpen) selectOption(options[highlightedIndex]);
					break;

				case "ArrowDown":
				case "ArrowUp": {
					if (!isOpen) {
						setIsOpen(true);
						break;
					}

					const newValue = highlightedIndex + (e.code === "ArrowDown" ? 1 : -1);

					if (newValue >= 0 && newValue < options.length)
						setHighlightedIndex(newValue);
					break;
				}

				case "Escape":
					setIsOpen(false);
					break;

				default:
					break;
			}
		}

		containerRef.current?.addEventListener("keydown", handler);

		return () => containerRef.current?.removeEventListener("keydown", handler);
	}, [isOpen, highlightedIndex, options]);

	function clearOptions() {
		multiple ? onChange([]) : onChange(undefined);
	}

	function selectOption(option: SelectOption) {
		if (multiple) {
			if (value.includes(option)) {
				onChange(value.filter(option_ => option_ !== option));
			} else {
				onChange([...value, option]);
			}
		} else {
			if (option !== value) onChange(option);
		}
	}

	function isOptionSelected(option: SelectOption) {
		return multiple ? value.includes(option) : option === value;
	}

	return (
		<div
			onClick={() => setIsOpen(prev => !prev)}
			onBlur={() => setIsOpen(false)}
			className={styles.container}
			ref={containerRef}
			tabIndex={0}
		>
			<span className={styles.value}>
				{multiple
					? value.map(v => (
							<button
								className={styles["option-badge"]}
								key={v.value}
								onClick={e => {
									e.stopPropagation();
									selectOption(v);
								}}
							>
								{v.label}

								<span className={styles["remove-button"]}>&times;</span>
							</button>
					  ))
					: value?.label}
			</span>

			<button
				className={styles["clear-button"]}
				onClick={e => {
					e.stopPropagation();
					clearOptions();
				}}
			>
				&times;
			</button>

			<div className={styles.divider}></div>

			<div className={styles.caret}></div>

			<ul className={`${styles.options} ${isOpen ? styles.show : ""}`}>
				{options.map((option, index) => (
					<li
						onMouseEnter={() => setHighlightedIndex(index)}
						key={option.value}
						onClick={e => {
							e.stopPropagation();
							selectOption(option);
							setIsOpen(false);
						}}
						className={`${styles.option} ${
							isOptionSelected(option) ? styles.selected : ""
						} ${index === highlightedIndex ? styles.highlighted : ""}`}
					>
						{option.label}
					</li>
				))}
			</ul>
		</div>
	);
}

////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////
// Types:

export type SelectOption = { label: string; value: string | number };

export type SelectProps = {
	options: SelectOption[];
} & (SingleSelectProps | MultipleSelectProps);

export type SingleSelectProps = {
	onChange(newValue: SelectOption | undefined): void;
	value: SelectOption | undefined;
	multiple?: false;
};

export type MultipleSelectProps = {
	onChange(newValue: SelectOption[]): void;
	value: SelectOption[];
	multiple: true;
};
