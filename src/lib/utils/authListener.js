import pb from '$lib/pocketbase';

let listenersInitialized = false;

let resetCallbacks = [];

export const registerAuthReset = (cb) => {
	resetCallbacks.push(cb);
};

export const initAuthListener = () => {
	if (listenersInitialized) return;
	listenersInitialized = true;

	pb.authStore.onChange(() => {
		resetCallbacks.forEach((cb) => cb());
	});
};
