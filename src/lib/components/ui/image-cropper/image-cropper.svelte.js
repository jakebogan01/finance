import { Context } from 'runed';
import { getCroppedImg } from './utils';

// https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img#supported_image_formats
export const VALID_IMAGE_TYPES = [
	'image/apng',
	'image/avif',
	'image/gif',
	'image/jpeg',
	'image/png',
	'image/svg+xml',
	'image/webp'
];

class ImageCropperRootState {
	#createdUrls = $state([]);
	open = $state(false);
	tempUrl = $state();
	pixelCrop = $state();

	constructor(opts) {
		this.opts = opts;

		this.onUpload = this.onUpload.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.onCrop = this.onCrop.bind(this);
		this.dispose = this.dispose.bind(this);
	}

	onUpload(file) {
		if (!VALID_IMAGE_TYPES.includes(file.type)) {
			this.opts.onUnsupportedFile.current(file);
			return;
		}

		this.tempUrl = URL.createObjectURL(file);
		this.#createdUrls.push(this.tempUrl);
		this.open = true;
	}

	onCancel() {
		this.tempUrl = undefined;
		this.open = false;
		this.pixelCrop = undefined;
	}

	async onCrop() {
		if (!this.pixelCrop || !this.tempUrl) return;

		this.opts.src.current = await getCroppedImg(this.tempUrl, this.pixelCrop);

		this.open = false;

		this.opts.onCropped.current(this.opts.src.current);
	}

	get src() {
		return this.opts.src.current;
	}

	get id() {
		return this.opts.id.current;
	}

	dispose() {
		for (const url of this.#createdUrls) {
			URL.revokeObjectURL(url);
		}
	}
}

class ImageCropperTriggerState {
	constructor(rootState) {
		this.rootState = rootState;
	}
}

class ImageCropperPreviewState {
	constructor(rootState) {
		this.rootState = rootState;
	}
}

class ImageCropperDialogState {
	constructor(rootState) {
		this.rootState = rootState;
	}
}

class ImageCropperCropperState {
	constructor(rootState) {
		this.rootState = rootState;
		this.onCropComplete = this.onCropComplete.bind(this);
	}

	onCropComplete(e) {
		this.rootState.pixelCrop = e.pixels;
	}
}

class ImageCropperCropState {
	constructor(rootState) {
		this.rootState = rootState;
		this.onclick = this.onclick.bind(this);
	}

	onclick() {
		this.rootState.onCrop();
	}
}

class ImageCropperCancelState {
	constructor(rootState) {
		this.rootState = rootState;
		this.onclick = this.onclick.bind(this);
	}

	onclick() {
		this.rootState.onCancel();
	}
}

const ImageCropperRootContext = new Context('ImageCropper.Root');

export const useImageCropperRoot = (props) => {
	return ImageCropperRootContext.set(new ImageCropperRootState(props));
};

export const useImageCropperTrigger = () => {
	const rootState = ImageCropperRootContext.get();
	return new ImageCropperTriggerState(rootState);
};

export const useImageCropperPreview = () => {
	const rootState = ImageCropperRootContext.get();
	return new ImageCropperPreviewState(rootState);
};

export const useImageCropperDialog = () => {
	const rootState = ImageCropperRootContext.get();
	return new ImageCropperDialogState(rootState);
};

export const useImageCropperCropper = () => {
	const rootState = ImageCropperRootContext.get();
	return new ImageCropperCropperState(rootState);
};

export const useImageCropperCrop = () => {
	const rootState = ImageCropperRootContext.get();
	return new ImageCropperCropState(rootState);
};

export const useImageCropperCancel = () => {
	const rootState = ImageCropperRootContext.get();
	return new ImageCropperCancelState(rootState);
};
