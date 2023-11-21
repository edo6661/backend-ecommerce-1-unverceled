import bcrypt from 'bcrypt';
const matchPassword = async (password: string, enteredPassword: string) => {
	return await bcrypt.compare(password, enteredPassword);
};

export default matchPassword;
