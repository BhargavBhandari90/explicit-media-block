const { execSync } = require('child_process');

async function globalTeardown() {
    console.log('🔁 Ensuring wp-env is running...');

    try {
		execSync(`npx wp-env start`, { stdio: 'inherit' });
	} catch (e) {
		console.warn('⚠️ wp-env already running or failed to start');
	}

	console.log('🧹 Cleaning up test content...');

	const run = (cmd) => {
		try {
			execSync(`npx wp-env run cli wp ${cmd}`, { stdio: 'inherit' });
		} catch (e) {
			console.warn(`Failed: wp ${cmd}`);
		}
	};

	// Example cleanup commands
	run(`post delete $(wp post list --post_type=post --post_title="Explicit Media Test" --format=ids) --force`);
	run(`post delete $(wp post list --post_type=attachment --format=ids) --force`);

	console.log('✅ Cleanup complete.');
}

module.exports = globalTeardown;
