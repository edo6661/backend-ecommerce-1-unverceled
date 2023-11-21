const validateRoles = (userRoles, roles) => {
	//! Ubah roles menjadi array, jika bukan array
	const userRolesArray = Array.isArray(roles) ? roles : [roles];

	//! Periksa apakah setiap peran yang dimasukkan oleh pengguna adalah peran yang valid
	const invalidRoles = userRolesArray.filter(
		(role) => !userRoles.includes(role)
	);

	return invalidRoles;
};

export default validateRoles;
