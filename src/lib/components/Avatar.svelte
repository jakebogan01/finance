<script>
	import * as ImageCropper from '$lib/components/ui/image-cropper';
	import { toast } from 'svelte-sonner';
	import pb from '$lib/pocketbase';
	import * as zod from 'zod';

	let loading = $state(false);

	const avatarSchema = zod
		.instanceof(File)
		.refine((file) => file.type === 'image/webp', {
			message: 'Avatar must be WebP'
		})
		.refine((file) => file.size < 81_920, {
			message: 'File cannot exceed 80 KB'
		});

	const getAvatarUrl = () => {
		const record = pb.authStore.record;
		if (!record?.avatar) return '';
		return pb.files.getURL(record, record.avatar, {
			token: pb.authStore.token,
			query: { t: Date.now() } // cache bust
		});
	};

	const convertToWebP = async (blob, quality = 0.8) => {
		const bitmap = await createImageBitmap(blob);
		const canvas = document.createElement('canvas');
		canvas.width = bitmap.width;
		canvas.height = bitmap.height;
		const ctx = canvas.getContext('2d');
		if (!ctx) throw new Error('Canvas context failed');
		ctx.drawImage(bitmap, 0, 0);
		const webpBlob = await new Promise((resolve, reject) => {
			canvas.toBlob(
				(blob) => (blob ? resolve(blob) : reject(new Error('WebP conversion failed'))),
				'image/webp',
				quality
			);
		});
		return new File([webpBlob], 'avatar.webp', { type: 'image/webp' });
	};

	const handleCropped = async (blobUrl) => {
		if (loading) return;
		let objectUrl;
		try {
			loading = true;
			if (typeof blobUrl !== 'string' || !blobUrl.startsWith('blob:')) {
				throw new Error('Invalid cropper output');
			}
			objectUrl = blobUrl;
			const blob = await fetch(objectUrl).then((r) => r.blob());
			const webpFile = await convertToWebP(blob);
			const result = avatarSchema.safeParse(webpFile);
			if (!result.success) {
				throw new Error(result.error.issues[0].message);
			}
			const record = pb.authStore.record;
			if (!record?.id) {
				throw new Error('User not authenticated');
			}
			await pb.collection('users').update(record.id, {
				avatar: webpFile
			});
			toast.success('Avatar updated');
		} catch (err) {
			console.error(err);
			toast.error(err?.message ?? 'Upload failed');
		} finally {
			if (objectUrl) URL.revokeObjectURL(objectUrl);
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
