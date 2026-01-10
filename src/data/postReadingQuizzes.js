/**
 * Post-Reading Quizzes Data
 * Short quizzes that appear after viewing heritage details
 * Tests user comprehension and awards bonus points
 */

export const postReadingQuizzes = {
  // Căn cứ Cái Chanh
  1: {
    heritageId: 1,
    heritageName: 'Căn cứ Cái Chanh',
    questions: [
      {
        id: 'h1_q1',
        type: 'multiple_choice',
        question: 'Căn cứ Cái Chanh được xếp hạng di tích quốc gia đặc biệt năm nào?',
        questionEn: 'In what year was Cai Chanh Base recognized as a special national relic?',
        options: ['2011', '2013', '2015', '2017'],
        optionsEn: ['2011', '2013', '2015', '2017'],
        correct: 1,
        explanation: 'Căn cứ Cái Chanh được xếp hạng di tích quốc gia đặc biệt vào năm 2013.',
        explanationEn: 'Cai Chanh Base was recognized as a special national relic in 2013.',
      },
      {
        id: 'h1_q2',
        type: 'true_false',
        question: 'Căn cứ Cái Chanh nằm ở huyện Phú Tân.',
        questionEn: 'Cai Chanh Base is located in Phu Tan District.',
        correct: true,
        explanation: 'Đúng vậy, căn cứ thuộc xã Phú Mỹ, huyện Phú Tân, tỉnh Cà Mau.',
        explanationEn: 'Correct, the base is located in Phu My commune, Phu Tan district, Ca Mau province.',
      },
    ],
  },

  // Đình Tân Hưng
  2: {
    heritageId: 2,
    heritageName: 'Đình Tân Hưng',
    questions: [
      {
        id: 'h2_q1',
        type: 'multiple_choice',
        question: 'Đình Tân Hưng được xây dựng vào năm nào?',
        questionEn: 'When was Tan Hung Communal House built?',
        options: ['1890', '1902', '1910', '1920'],
        optionsEn: ['1890', '1902', '1910', '1920'],
        correct: 1,
        explanation: 'Đình Tân Hưng được xây dựng vào năm 1902.',
        explanationEn: 'Tan Hung Communal House was built in 1902.',
      },
      {
        id: 'h2_q2',
        type: 'multiple_choice',
        question: 'Đình Tân Hưng thuộc loại xếp hạng di tích nào?',
        questionEn: 'What type of ranking does Tan Hung Communal House have?',
        options: ['Quốc gia đặc biệt', 'Quốc gia', 'Cấp tỉnh', 'Chưa xếp hạng'],
        optionsEn: ['Special National', 'National', 'Provincial', 'Not ranked'],
        correct: 1,
        explanation: 'Đình Tân Hưng được xếp hạng di tích cấp quốc gia.',
        explanationEn: 'Tan Hung Communal House is ranked as a national-level relic.',
      },
    ],
  },

  // Đền thờ Bác Hồ
  3: {
    heritageId: 3,
    heritageName: 'Đền thờ Bác Hồ',
    questions: [
      {
        id: 'h3_q1',
        type: 'true_false',
        question: 'Đền thờ Bác Hồ là nơi thờ phụng Chủ tịch Hồ Chí Minh.',
        questionEn: 'The Temple of Uncle Ho is a place of worship for President Ho Chi Minh.',
        correct: true,
        explanation: 'Đền thờ Bác Hồ được xây dựng để tưởng nhớ và thờ phụng Chủ tịch Hồ Chí Minh.',
        explanationEn: 'The Temple of Uncle Ho was built to commemorate and worship President Ho Chi Minh.',
      },
      {
        id: 'h3_q2',
        type: 'multiple_choice',
        question: 'Đền thờ Bác Hồ nằm ở đâu?',
        questionEn: 'Where is the Temple of Uncle Ho located?',
        options: ['TP. Cà Mau', 'Huyện Phú Tân', 'Huyện Năm Căn', 'Huyện Thới Bình'],
        optionsEn: ['Ca Mau City', 'Phu Tan District', 'Nam Can District', 'Thoi Binh District'],
        correct: 0,
        explanation: 'Đền thờ Bác Hồ nằm ở thành phố Cà Mau.',
        explanationEn: 'The Temple of Uncle Ho is located in Ca Mau City.',
      },
    ],
  },

  // Chùa Quan Âm
  4: {
    heritageId: 4,
    heritageName: 'Chùa Quan Âm',
    questions: [
      {
        id: 'h4_q1',
        type: 'multiple_choice',
        question: 'Chùa Quan Âm thuộc tôn giáo nào?',
        questionEn: 'What religion does Quan Am Pagoda belong to?',
        options: ['Cao Đài', 'Phật giáo', 'Thiên Chúa giáo', 'Hồi giáo'],
        optionsEn: ['Cao Dai', 'Buddhism', 'Christianity', 'Islam'],
        correct: 1,
        explanation: 'Chùa Quan Âm là một ngôi chùa Phật giáo.',
        explanationEn: 'Quan Am Pagoda is a Buddhist temple.',
      },
      {
        id: 'h4_q2',
        type: 'true_false',
        question: 'Quan Âm là tên gọi của Đức Phật Thích Ca.',
        questionEn: 'Quan Am is another name for Buddha Shakyamuni.',
        correct: false,
        explanation: 'Quan Âm (Quan Thế Âm Bồ Tát) là một vị Bồ Tát trong Phật giáo, không phải Đức Phật Thích Ca.',
        explanationEn: 'Quan Am (Avalokitesvara Bodhisattva) is a Bodhisattva in Buddhism, not Buddha Shakyamuni.',
      },
    ],
  },

  // Di tích lịch sử Hòn Đá Bạc
  5: {
    heritageId: 5,
    heritageName: 'Di tích lịch sử Hòn Đá Bạc',
    questions: [
      {
        id: 'h5_q1',
        type: 'multiple_choice',
        question: 'Hòn Đá Bạc nằm ở huyện nào của tỉnh Cà Mau?',
        questionEn: 'In which district of Ca Mau province is Hon Da Bac located?',
        options: ['Phú Tân', 'Trần Văn Thời', 'Năm Căn', 'U Minh'],
        optionsEn: ['Phu Tan', 'Tran Van Thoi', 'Nam Can', 'U Minh'],
        correct: 1,
        explanation: 'Hòn Đá Bạc thuộc xã Khánh Bình Tây Bắc, huyện Trần Văn Thời.',
        explanationEn: 'Hon Da Bac is located in Khanh Binh Tay Bac commune, Tran Van Thoi district.',
      },
      {
        id: 'h5_q2',
        type: 'true_false',
        question: 'Hòn Đá Bạc là một hòn đảo nằm ở biển.',
        questionEn: 'Hon Da Bac is an island in the sea.',
        correct: true,
        explanation: 'Hòn Đá Bạc là một đảo nhỏ nằm ở vùng biển Cà Mau.',
        explanationEn: 'Hon Da Bac is a small island located in the Ca Mau sea area.',
      },
    ],
  },

  // Khu di tích Bến Vàm Lũng
  6: {
    heritageId: 6,
    heritageName: 'Khu di tích Bến Vàm Lũng',
    questions: [
      {
        id: 'h6_q1',
        type: 'multiple_choice',
        question: 'Bến Vàm Lũng có vai trò gì trong lịch sử?',
        questionEn: 'What role did Ben Vam Lung play in history?',
        options: [
          'Cảng thương mại',
          'Bến tiếp nhận vũ khí từ miền Bắc',
          'Cảng đánh cá',
          'Bến phà',
        ],
        optionsEn: [
          'Commercial port',
          'Port for receiving weapons from the North',
          'Fishing port',
          'Ferry terminal',
        ],
        correct: 1,
        explanation: 'Bến Vàm Lũng là nơi tiếp nhận vũ khí từ miền Bắc chi viện cho miền Nam trong kháng chiến.',
        explanationEn: 'Ben Vam Lung was a port for receiving weapons from the North to support the South during the resistance war.',
      },
      {
        id: 'h6_q2',
        type: 'true_false',
        question: 'Bến Vàm Lũng thuộc huyện Ngọc Hiển.',
        questionEn: 'Ben Vam Lung is located in Ngoc Hien District.',
        correct: true,
        explanation: 'Bến Vàm Lũng thuộc xã Tân Ân, huyện Ngọc Hiển, tỉnh Cà Mau.',
        explanationEn: 'Ben Vam Lung is located in Tan An commune, Ngoc Hien district, Ca Mau province.',
      },
    ],
  },

  // Default quiz for heritages without specific questions
  default: {
    heritageId: 0,
    heritageName: 'Di sản văn hóa',
    questions: [
      {
        id: 'default_q1',
        type: 'true_false',
        question: 'Tỉnh Cà Mau nằm ở cực Nam của Việt Nam.',
        questionEn: 'Ca Mau province is located at the southernmost point of Vietnam.',
        correct: true,
        explanation: 'Cà Mau là tỉnh cực Nam của Việt Nam, nơi có Mũi Cà Mau - điểm cực Nam đất nước.',
        explanationEn: 'Ca Mau is the southernmost province of Vietnam, home to Ca Mau Cape - the southernmost point of the country.',
      },
      {
        id: 'default_q2',
        type: 'multiple_choice',
        question: 'Cà Mau có bao nhiêu huyện/thành phố?',
        questionEn: 'How many districts/cities does Ca Mau have?',
        options: ['7', '8', '9', '10'],
        optionsEn: ['7', '8', '9', '10'],
        correct: 2,
        explanation: 'Cà Mau có 9 đơn vị hành chính cấp huyện: 1 thành phố và 8 huyện.',
        explanationEn: 'Ca Mau has 9 district-level administrative units: 1 city and 8 districts.',
      },
    ],
  },
};

/**
 * Get quiz for a specific heritage
 * @param {number} heritageId - Heritage ID
 * @returns {Object} Quiz data
 */
export function getQuizForHeritage(heritageId) {
  return postReadingQuizzes[heritageId] || postReadingQuizzes.default;
}

/**
 * Get random question from a heritage quiz
 * @param {number} heritageId - Heritage ID
 * @param {number} count - Number of questions to get
 * @returns {Array} Array of questions
 */
export function getRandomQuestions(heritageId, count = 2) {
  const quiz = getQuizForHeritage(heritageId);
  const questions = [...quiz.questions];

  // Shuffle and take 'count' questions
  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questions[i], questions[j]] = [questions[j], questions[i]];
  }

  return questions.slice(0, Math.min(count, questions.length));
}

/**
 * Check if a heritage has specific quiz questions
 * @param {number} heritageId - Heritage ID
 * @returns {boolean}
 */
export function hasCustomQuiz(heritageId) {
  return heritageId in postReadingQuizzes && heritageId !== 'default';
}

export default postReadingQuizzes;
