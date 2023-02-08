import Pusher from 'pusher-js';
import { PUBLIC_PUSHER_KEY, PUBLIC_PUSHER_CLUSTER } from '$env/static/public';

const pusher = new Pusher(PUBLIC_PUSHER_KEY, {
	cluster: PUBLIC_PUSHER_CLUSTER
});

export default pusher;
