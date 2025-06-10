import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './TestPage.scss';

const testQuestions = {
  1: [
    {
      question: 'В каком веке был построен Астраханский кремль?',
      options: ['XIV', 'XVI', 'XVIII', 'XIX'],
      correctIndex: 1
    },
    {
      question: 'Из какого основного материала построен кремль?',
      options: ['Кирпич', 'Дерево', 'Белый камень', 'Известняк'],
      correctIndex: 2
    },
    {
      question: 'На какой реке расположен Астраханский кремль?',
      options: ['Дон', 'Волга', 'Урал', 'Обь'],
      correctIndex: 1
    },
    {
      question: 'Как называется главный собор кремля?',
      options: [
        'Успенский собор',
        'Казанский собор',
        'Троицкий собор',
        'Благовещенский собор'
      ],
      correctIndex: 0
    },
    {
      question: 'Чем знаменит кремль?',
      options: [
        'Самый высокий в России',
        'Единственный каменный кремль на юге',
        'Построен Петром I',
        'Служил резиденцией царей'
      ],
      correctIndex: 1
    }
  ]
};

const AchievementPopup = ({ onClose }) => {
  return (
    <div className="achievement-popup">
      <div className="popup-content">
        <h3>Поздравляю, ты получил достижение!</h3>
        <button onClick={onClose}>Закрыть</button>
      </div>
    </div>
  );
};

const TestPage = () => {
  const testId = parseInt(1);
  const navigate = useNavigate();
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [showAchievement, setShowAchievement] = useState(false);

  const testIdNumber = Number(testId);
  const questions = testQuestions[testIdNumber] || [];

  useEffect(() => {
    setAnswers(Array(questions.length).fill(null));
  }, [questions.length]);

  const storedUser = JSON.parse(localStorage.getItem('user'));

  if (!storedUser || !Array.isArray(storedUser.test_info)) {
    return <div>Ошибка: пользователь не найден. Войдите заново.</div>;
  }

  if (isNaN(testIdNumber)) {
    return <div>Ошибка: некорректный ID теста</div>;
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

      // Показываем попап достижения только если тест пройден впервые
      if (!isAlreadyPassed) {
        setShowAchievement(true);
      }

      alert(`Тест завершён! Баллов: ${correctCount} из ${questions.length}`);
    } catch (err) {
      console.error('Ошибка при отправке результата:', err);
      alert('Ошибка при сохранении результата теста.');
    }
  };

  const closeAchievementPopup = () => {
    setShowAchievement(false);
    navigate('/dashboard');
  };

  return (
    <div className="test-page">
      <h2>Тест #{testIdNumber}</h2>

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