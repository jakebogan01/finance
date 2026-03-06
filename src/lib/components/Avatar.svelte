<script>
	import * as ImageCropper from '$lib/components/ui/image-cropper';
	import { toast } from 'svelte-sonner';
	import pb from '$lib/pocketbase';
	import * as zod from 'zod';

	let loading = $state(false);
	let avatarUrl = $state(null);

	const avatarSchema = zod
		.instanceof(File)
		.refine((file) => file.type === 'image/webp', {
			message: 'Avatar must be WebP'
		})
		.refine((file) => file.size < 81_920, {
			message: 'File cannot exceed 80 KB'
		});

	const updateAvatarUrl = () => {
		const record = pb.authStore.record;

		if (!record || !record.avatar) {
			avatarUrl = null;
			return;
		}

		avatarUrl = pb.files.getURL(record, record.avatar, {
			token: pb.authStore.token
		});
	};

	const getAvatarUrl = () => {
		const record = pb.authStore.record;

		if (!record?.avatar) return '';

		return pb.files.getURL(record, record.avatar, {
			token: pb.authStore.token,
			query: { t: Date.now() }
		});
	};

	const convertToWebP = async (blob, quality = 0.8) => {
		return new Promise((resolve, reject) => {
			const img = new Image();
			const objectUrl = URL.createObjectURL(blob);

			img.onload = () => {
				URL.revokeObjectURL(objectUrl);

				const canvas = document.createElement('canvas');
				canvas.width = img.width;
				canvas.height = img.height;

				const ctx = canvas.getContext('2d');
				if (!ctx) {
					reject(new Error('Canvas context failed'));
					return;
				}

				ctx.drawImage(img, 0, 0);

				canvas.toBlob(
					(webpBlob) => {
						if (!webpBlob) {
							reject(new Error('WebP conversion failed'));
							return;
						}

						resolve(
							new File([webpBlob], 'avatar.webp', {
								type: 'image/webp'
							})
						);
					},
					'image/webp',
					quality
				);
			};

			img.onerror = () => {
				URL.revokeObjectURL(objectUrl);
				reject(new Error('Image load failed'));
			};

			img.src = objectUrl;
		});
	};

	const handleCropped = async (blobUrl) => {
		if (loading) return;

		try {
			loading = true;

			if (typeof blobUrl !== 'string' || !blobUrl.startsWith('blob:')) {
				throw new Error('Invalid cropper output');
			}

			const response = await fetch(blobUrl);
			const blob = await response.blob();

			URL.revokeObjectURL(blobUrl);

			const webpFile = await convertToWebP(blob, 0.8);

			const result = avatarSchema.safeParse(webpFile);
			if (!result.success) {
				toast.error(result.error.issues[0].message);
				return;
			}

			const userId = pb.authStore.record?.id;
			if (!userId) {
				toast.error('User not authenticated');
				return;
			}

			const formData = new FormData();
			formData.append('avatar', webpFile);

			for (const [key, value] of formData.entries()) {
				console.log(key, value);
			}

			await pb.collection('users').update(userId, { avatar: webpFile });
			updateAvatarUrl();
		} catch (err) {
			console.dir(err?.response, { depth: null });
			toast.error(err?.message ?? 'Upload failed');
		} finally {
			loading = false;
		}
	};
</script>

<ImageCropper.Root
	src={getAvatarUrl()}
	onCropped={handleCropped}
	onUnsupportedFile={(file) => {
		toast.error(`Unsupported file type: ${file.type}`);
	}}
>
	<ImageCropper.UploadTrigger>
		<ImageCropper.Preview class="rounded-full" />
	</ImageCropper.UploadTrigger>

	<ImageCropper.Dialog>
		<ImageCropper.Cropper cropShape="rect" />
		<ImageCropper.Controls>
			<ImageCropper.Cancel />
			<ImageCropper.Crop disabled={loading} />
		</ImageCropper.Controls>
	</ImageCropper.Dialog>
</ImageCropper.Root>
