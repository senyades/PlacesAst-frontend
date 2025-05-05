import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TestPage.scss';

const testQuestions = {
  4: [
    {
      question: 'Какая рыба считается символом низовьев Волги?',
      options: ['Судак', 'Сом', 'Осётр', 'Щука'],
      correctIndex: 2
    },
    {
      question: 'Какая рыба чаще всего встречается в дельте Волги?',
      options: ['Карась', 'Плотва', 'Лещ', 'Сазан'],
      correctIndex: 3
    },
    {
      question: 'Какие из перечисленных видов занесены в Красную книгу?',
      options: ['Сельдь и окунь', 'Осётр и белуга', 'Судак и щука', 'Сом и линь'],
      correctIndex: 1
    },
    {
      question: 'Какой промысел исторически был важен для региона?',
      options: ['Улов раков', 'Промысел сома', 'Ловля осетровых', 'Выращивание карпа'],
      correctIndex: 2
    },
    {
      question: 'Какое влияние оказывает браконьерство на ихтиофауну?',
      options: [
        'Увеличивает популяцию рыб',
        'Не влияет',
        'Стимулирует рыболовство',
        'Сокращает численность редких видов'
      ],
      correctIndex: 3
    }
  ]
};

const TestPage = () => {
  const testIdNumber = 4; // ID теста — ихтиофауна Волги
  const questions = testQuestions[testIdNumber] || [];

  const navigate = useNavigate();
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

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

      alert(`Тест завершён! Баллов: ${correctCount} из ${questions.length}`);
      navigate('/dashboard');
    } catch (err) {
      console.error('Ошибка при отправке результата:', err);
      alert('Ошибка при сохранении результата теста.');
    }
  };

  return (
    <div className="test-page">
      <h2>Тест #{testIdNumber}: Ихтиофауна низовий Волги</h2>

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
    </div>
  );
};

export default TestPage;
