import Swal from "sweetalert2";

export function showSuccessAlert(title, text) {
    return Swal.fire({
        title: title,
        text: text,
        icon: 'success', // ใช้ 'success' เพื่อแสดงไอคอนสีเขียว
        confirmButtonText: 'ตกลง'
    });
};

export function showErrorAlert(title, text) {
    return Swal.fire({
        title: title,
        text: text,
        icon: 'error', // ใช้ 'error' เพื่อแสดงไอคอนสีแดง
        confirmButtonText: 'ตกลง'
    });
};