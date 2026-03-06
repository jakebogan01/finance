export const getFileFromUrl = async (url, fileName = 'cropped.png') => {
	// Fetch the file data from the URL
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`Failed to fetch resource: ${response.status} ${response.statusText}`);
	}

	// Convert the response into a Blob
	const blob = await response.blob();

	// Create and return a File. You can set a custom type if needed.
	return new File([blob], fileName, { type: blob.type });
};

const createImage = (url) => {
	return new Promise((resolve, reject) => {
		const image = new Image();
		image.addEventListener('load', () => resolve(image));
		image.addEventListener('error', (error) => reject(error));
		image.setAttribute('crossOrigin', 'anonymous'); // needed to avoid cross-origin issues
		image.src = url;
	});
};

const getRadianAngle = (degreeValue) => {
	return (degreeValue * Math.PI) / 180;
};

/** Gets the cropped image from the src using the cropped area */
export const getCroppedImg = async (imageSrc, pixelCrop, rotation = 0) => {
	const image = await createImage(imageSrc);
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');

	if (!ctx) {
		throw new Error('Error getting 2d rendering context');
	}

	const maxSize = Math.max(image.width, image.height);
	const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

	// set each dimension to allow safe rotation area
	canvas.width = safeArea;
	canvas.height = safeArea;

	// rotate around center
	ctx.translate(safeArea / 2, safeArea / 2);
	ctx.rotate(getRadianAngle(rotation));
	ctx.translate(-safeArea / 2, -safeArea / 2);

	// draw rotated image
	ctx.drawImage(image, safeArea / 2 - image.width * 0.5, safeArea / 2 - image.height * 0.5);
	const data = ctx.getImageData(0, 0, safeArea, safeArea);

	// set canvas to crop size (clears context)
	canvas.width = pixelCrop.width;
	canvas.height = pixelCrop.height;

	// paste rotated image with crop offsets
	ctx.putImageData(
		data,
		Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
		Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
	);

	return new Promise((resolve) => {
		canvas.toBlob((file) => {
			resolve(URL.createObjectURL(file));
		}, 'image/png');
	});
};
