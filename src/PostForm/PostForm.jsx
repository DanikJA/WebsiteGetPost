import "./PostForm.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import successImg from "../assets/success-image.svg";
import InputMask from "react-input-mask";
// import defaultPhoto from "../assets/cover.svg";

// Основний компонент форми
const PostForm = () => {
  const [positions, setPositions] = useState([]); // список доступних позицій (з бекенду)
  const [selectedPosition, setSelectedPosition] = useState(null); // обрана позиція
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "+38 (0", // за замовчуванням — частина маски номера
    photo: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false); // чи триває відправка
  const [isSuccess, setIsSuccess] = useState(false); // чи вдала реєстрація

  // Завантаження списку позицій при монтуванні компонента
  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const res = await axios.get(
          "https://frontend-test-assignment-api.abz.agency/api/v1/positions"
        );
        setPositions(res.data.positions);
      } catch (error) {
        console.error("Failed to load positions:", error);
      }
    };

    fetchPositions();
  }, []);

  // Скидання форми після успішної реєстрації
  const clearForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "+38 (0",
      photo: null,
    });
    setSelectedPosition(null);

    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = "";
    }
  };

  // Обробка відправки форми
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPosition || !formData.photo) {
      alert("Please select position and upload photo.");
      return;
    }

    setIsSubmitting(true); // ставимо статус "йде відправка"

    try {
      // Отримуємо токен з API
      const tokenRes = await axios.get(
        "https://frontend-test-assignment-api.abz.agency/api/v1/token"
      );
      const token = tokenRes.data.token;

      // Очищаємо номер від усіх символів, крім цифр
      const cleanedPhone = formData.phone.replace(/\D/g, "");

      // Створюємо форму для відправки
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phone", `+${cleanedPhone}`); // у форматі +380XXXXXXXXX
      data.append("position_id", selectedPosition);
      data.append("photo", formData.photo);

      // Відправка POST-запиту
      const res = await axios.post(
        "https://frontend-test-assignment-api.abz.agency/api/v1/users",
        data,
        {
          headers: {
            Token: token,
          },
        }
      );

      console.log("Success:", res.data);
      clearForm(); // очищаємо поля
      setIsSuccess(true); // показуємо success-меседж
    } catch (err) {
      console.error("Submit error:", err.response?.data || err.message);
      if (err.response?.data?.message) {
        alert(`Error: ${err.response.data.message}`);
      } else {
        alert("Registration failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false); // вимикаємо статус "йде відправка"
    }
  };

  // Перевірка номера: залишаємо лише цифри
  const cleanedPhone = formData.phone.replace(/\D/g, "");

  // Перевірка валідності форми
  const isFormValid =
    formData.name.trim() !== "" &&
    formData.email.trim() !== "" &&
    cleanedPhone.length === 12 &&
    selectedPosition !== null &&
    formData.photo !== null;

  return (
    <section className="post-form">
      {isSuccess ? (
        <div className="success-message">
          <div className="success-content">
            <h2 className="success-title">User successfully registered</h2>
            <img className="success-image" src={successImg} alt="Success" />
          </div>
          <p className="success-footer">
            © abz.agency specially for the test task
          </p>
        </div>
      ) : (
        // Інакше — форма
        <>
          <h2 className="post-form__title">Working with POST request</h2>
          <form className="form" onSubmit={handleSubmit}>
            {/* Поле: ім’я */}
            <input
              className="post-form-input"
              type="text"
              name="name"
              placeholder="Your name"
              required
              minLength="2"
              maxLength="60"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              disabled={isSubmitting}
            />

            {/* Поле: email */}
            <input
              className="post-form-input"
              type="email"
              name="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              disabled={isSubmitting}
            />

            {/* Поле: телефон з маскою */}
            <InputMask
              mask="+38 (099) 999 99 99" // Маска, яка змушує користувача вводити в правильному форматі
              maskChar="_"
              value={formData.phone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, phone: e.target.value }))
              }
              disabled={isSubmitting}
            >
              {(inputProps) => (
                <input
                  {...inputProps}
                  className="post-form-input"
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  required
                />
              )}
            </InputMask>

            <p className="form__hint">+38 (XXX) XXX - XX - XX</p>

            {/* Блок: вибір позиції */}
            <p className="form__label">Select your position</p>
            {positions.map((pos) => (
              <label key={pos.id} className="post-form-input-radio">
                <input
                  type="radio"
                  name="position"
                  value={pos.id}
                  checked={selectedPosition === pos.id}
                  onChange={() => setSelectedPosition(pos.id)}
                  required
                  disabled={isSubmitting}
                />
                {pos.name}
              </label>
            ))}

            {/* Блок: завантаження фото */}
            <div className="upload-block">
              <label htmlFor="photo-upload" className="upload-label">
                Upload
              </label>
              <input
                type="file"
                id="photo-upload"
                name="photo"
                accept=".jpg,.jpeg"
                required
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    photo: e.target.files[0],
                  }))
                }
                disabled={isSubmitting}
                className="upload-input"
              />
              <span className="upload-filename">
                {formData.photo ? formData.photo.name : "Upload your photo"}
              </span>
            </div>

            {/* Кнопка надсилання */}
            <button
              type="submit"
              className="form__submit"
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Sign up"}
            </button>
          </form>
        </>
      )}
    </section>
  );
};

export default PostForm;
