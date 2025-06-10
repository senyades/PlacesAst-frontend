import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TestPage.scss';

const testQuestions = {
  8: [
    {
      question: 'С какими именами связано строительство хурула?',
      options: ['Джамбой Тундутов и Тюмень-Джиргалан', 'Петр I и Екатерина II', 'Лев Толстой и Максим Горький'],
      correctIndex: 0
    },
    {
      question: 'В каком году началось строительство хурула?',
      options: ['1800', '1814', '1820'],
      correctIndex: 1
    },
    {
      question: 'Какая из следующих акций не проходила в помощь армии во время войны 1812?',
      options: ['Сбор денег', 'Формирование полков', 'Сбор пожертвований на школьное строительство'],
      correctIndex: 2
    },
    {
      question: ' Сколько всадников было в каждом из двух калмыцких полков?',
      options: ['250', '500', '1000'],
      correctIndex: 1
    },
    {
      question: 'Чей проект архитектуры был основан на хуруле?',
      options: [
        'Батур-Убуши',
        'Гаван Джимбе',
        'Серебджаб Тюмень'
      ],
      correctIndex: 2
    }
  ]
};

const AchievementPopup = ({ onClose }) => {
  return (
    <div className="achievement-popup">
      <div className="popup-content">
        <div className="achievement-icon">🏯</div>
        <h3>Поздравляем!</h3>
        <p>Вы получили достижение "Знаток Хошеутовского хурула"</p>
        <button onClick={onClose}>Отлично!</button>
      </div>
    </div>
  );
};

const TestPage = () => {
  const testIdNumber = 8;
  const questions = testQuestions[testIdNumber] || [];

  const navigate = useNavigate();
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [showAchievement, setShowAchievement] = useState(false);

  useEffect(() => {
    setAnswers(Array(questions.length).fill(null));
  }, [questions.length]);

  const storedUser = JSON.parse(localStorage.getItem('user'));

  if (!storedUser || !Array.isArray(storedUser.test_info)) {
    return <div>Ошибка: пользователь не найден. Войдите заново.</div>;
  }

  const currentTestStatus = storedUser.test_info.find(
    (t) => t.testid === testIdNumber
  );

  const isAlreadyPassed = currentTestStatus?.passed;

  const handleAnswer = (qIndex, optionIndex) => {
    if (isAlreadyPassed) return;
    const updated = [...answers];
    updated[qIndex] = optionIndex;
    setAnswers(updated);
  };

  const handleSubmit = async () => {
    const correctCount = questions.reduce((acc, q, idx) => {
      return acc + (answers[idx] === q.correctIndex ? 1 : 0);
    }, 0);

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/user/test-result`, {
        login: storedUser.login,
        testid: testIdNumber,
        score: correctCount
      });

      const updatedTests = storedUser.test_info.map((test) =>
        test.testid === testIdNumber
          ? { ...test, passed: true, score: correctCount }
          : test
      );

      const updatedUser = { ...storedUser, test_info: updatedTests };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setScore(correctCount);
      setSubmitted(true);

      // Показываем попап только при первом прохождении
      if (!isAlreadyPassed) {
        setShowAchievement(true);
      } else {
        alert(`Тест завершён! Баллов: ${correctCount} из ${questions.length}`);
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Ошибка при отправке результата:', err);
      alert('Ошибка при сохранении результата теста.');
    }
  };

  const closeAchievementPopup = () => {
    setShowAchievement(false);
    alert(`Тест завершён! Баллов: ${score} из ${questions.length}`);
    navigate('/dashboard');
  };

  return (
    <div className="test-page">
      <h2>Тест #{testIdNumber}: Хошеутовский хурул</h2>

      {isAlreadyPassed && (
        <div className="already-passed">
          Вы уже прошли этот тест. Баллы: {currentTestStatus.score} из {questions.length}
        </div>
      )}

      {questions.map((q, idx) => (
        <div key={idx} className="question-block">
          <h4>{q.question}</h4>
          <div className="options">
            {q.options.map((opt, optIdx) => (
              <label key={optIdx}>
                <input
                  type="radio"
                  name={`q${idx}`}
                  checked={answers[idx] === optIdx}
                  onChange={() => handleAnswer(idx, optIdx)}
                  disabled={isAlreadyPassed || submitted}
                />
                {opt}
              </label>
            ))}
          </div>
        </div>
      ))}

      {!isAlreadyPassed && !submitted && (
        <button
          onClick={handleSubmit}
          disabled={answers.includes(null)}
          className="submit-button"
        >
          Завершить тест
        </button>
      )}

      {showAchievement && <AchievementPopup onClose={closeAchievementPopup} />}
    </div>
  );
};

export default TestPage;