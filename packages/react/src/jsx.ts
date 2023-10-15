import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbol';
import {
	Type,
	Key,
	Ref,
	Props,
	ReactElementType
	// ELementType
} from 'shared/ReactType';

export const ReactElement = function (
	type: Type,
	key: Key,
	ref: Ref,
	props: Props
): ReactElementType {
	const element = {
		$$typeof: REACT_ELEMENT_TYPE,
		type,
		key,
		ref,
		props,
		__mark: 'OTTO'
	};
	return element;
};

export const jsx = (
	type: Type,
	config: any,
	...maybeChildren: any
): ReactElementType => {
	let key: Key = null;
	const props: any = {};
	const ref: Ref = null;

	for (const prop in config) {
		const val = config[prop];

		if (prop === 'key') {
			if (val !== 'undefined') {
				key = '' + val;
			}
			continue;
		}

		if (prop === 'ref') {
			if (val !== 'undefined') {
				key = '' + val;
			}
			continue;
		}

		if ({}.hasOwnProperty.call(config, prop)) {
			props[prop] = val;
		}
	}

	const maybeChildrenLength = maybeChildren.length;
	if (maybeChildrenLength) {
		if (maybeChildrenLength === 1) {
			props.children = maybeChildren[0];
		} else {
			props.children = maybeChildren;
		}
	}

	return ReactElement(type, key, ref, props);
};

export const jsxDEV = (type: Type, config: any): ReactElementType => {
	let key: Key = null;
	const props: any = {};
	const ref: Ref = null;

	for (const prop in config) {
		const val = config[prop];

		if (prop === 'key') {
			if (val !== 'undefined') {
				key = '' + val;
			}
			continue;
		}

		if (prop === 'ref') {
			if (val !== 'undefined') {
				key = '' + val;
			}
			continue;
		}

		if ({}.hasOwnProperty.call(config, prop)) {
			props[prop] = val;
		}
	}

	return ReactElement(type, key, ref, props);
};
