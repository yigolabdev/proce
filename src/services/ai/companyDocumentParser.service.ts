/**
 * Company Document Parser Service
 * 
 * 회사 소개서 문서를 파싱하여 회사 정보를 자동으로 추출합니다.
 * PDF, DOCX, TXT 등의 문서에서 회사명, 사업자번호, 업종, 직원 수 등을 추출합니다.
 */

export interface ParsedCompanyInfo {
	companyName?: string
	businessNumber?: string
	industry?: string
	employeeCount?: string
	employeeCountExact?: string
	address?: string
	website?: string
	establishedYear?: string
	ceo?: string
	description?: string
	confidence: number // 0-100: 추출된 정보의 신뢰도
	extractedFields: string[] // 추출에 성공한 필드 목록
}

class CompanyDocumentParserService {
	/**
	 * 문서 파일에서 텍스트 추출
	 */
	async extractTextFromFile(file: File): Promise<string> {
		const fileType = file.type
		const fileName = file.name.toLowerCase()

		try {
			// PDF 파일
			if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
				return await this.extractTextFromPDF(file)
			}
			
			// 텍스트 파일
			if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
				return await this.extractTextFromTXT(file)
			}
			
			// Word 문서 (DOCX)
			if (
				fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
				fileName.endsWith('.docx')
			) {
				return await this.extractTextFromDOCX(file)
			}

			throw new Error('지원하지 않는 파일 형식입니다. PDF, DOCX, TXT 파일을 업로드해주세요.')
		} catch (error) {
			console.error('텍스트 추출 실패:', error)
			throw error
		}
	}

	/**
	 * PDF에서 텍스트 추출 (실제 구현 시 pdf.js 등 라이브러리 필요)
	 */
	private async extractTextFromPDF(file: File): Promise<string> {
		// TODO: pdf.js나 백엔드 API를 통한 실제 PDF 파싱 구현
		// 현재는 시뮬레이션
		return new Promise((resolve) => {
			const reader = new FileReader()
			reader.onload = () => {
				// 실제로는 PDF 라이브러리로 파싱
				resolve(`[PDF 파일 시뮬레이션]\n파일명: ${file.name}\n크기: ${file.size} bytes`)
			}
			reader.readAsText(file)
		})
	}

	/**
	 * TXT에서 텍스트 추출
	 */
	private async extractTextFromTXT(file: File): Promise<string> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader()
			reader.onload = (e) => resolve(e.target?.result as string)
			reader.onerror = (e) => reject(e)
			reader.readAsText(file, 'UTF-8')
		})
	}

	/**
	 * DOCX에서 텍스트 추출 (실제 구현 시 mammoth.js 등 라이브러리 필요)
	 */
	private async extractTextFromDOCX(file: File): Promise<string> {
		// TODO: mammoth.js나 백엔드 API를 통한 실제 DOCX 파싱 구현
		return new Promise((resolve) => {
			const reader = new FileReader()
			reader.onload = () => {
				resolve(`[DOCX 파일 시뮬레이션]\n파일명: ${file.name}\n크기: ${file.size} bytes`)
			}
			reader.readAsText(file)
		})
	}

	/**
	 * 추출된 텍스트에서 회사 정보 파싱
	 */
	async parseCompanyInfo(text: string): Promise<ParsedCompanyInfo> {
		const result: ParsedCompanyInfo = {
			confidence: 0,
			extractedFields: [],
		}

		try {
			// 1. 회사명 추출
			const companyNameMatch = this.extractCompanyName(text)
			if (companyNameMatch) {
				result.companyName = companyNameMatch
				result.extractedFields.push('companyName')
			}

			// 2. 사업자등록번호 추출
			const businessNumberMatch = this.extractBusinessNumber(text)
			if (businessNumberMatch) {
				result.businessNumber = businessNumberMatch
				result.extractedFields.push('businessNumber')
			}

			// 3. 업종 추출
			const industryMatch = this.extractIndustry(text)
			if (industryMatch) {
				result.industry = industryMatch
				result.extractedFields.push('industry')
			}

			// 4. 직원 수 추출
			const employeeCountMatch = this.extractEmployeeCount(text)
			if (employeeCountMatch) {
				if (typeof employeeCountMatch === 'number') {
					result.employeeCountExact = employeeCountMatch.toString()
					result.extractedFields.push('employeeCount')
				} else {
					result.employeeCount = employeeCountMatch
					result.extractedFields.push('employeeCount')
				}
			}

			// 5. 주소 추출
			const addressMatch = this.extractAddress(text)
			if (addressMatch) {
				result.address = addressMatch
				result.extractedFields.push('address')
			}

			// 6. 웹사이트 추출
			const websiteMatch = this.extractWebsite(text)
			if (websiteMatch) {
				result.website = websiteMatch
				result.extractedFields.push('website')
			}

			// 7. 설립연도 추출
			const establishedYearMatch = this.extractEstablishedYear(text)
			if (establishedYearMatch) {
				result.establishedYear = establishedYearMatch
				result.extractedFields.push('establishedYear')
			}

			// 8. 대표자명 추출
			const ceoMatch = this.extractCEO(text)
			if (ceoMatch) {
				result.ceo = ceoMatch
				result.extractedFields.push('ceo')
			}

			// 신뢰도 계산 (추출된 필드 수 / 주요 필드 수)
			const requiredFields = ['companyName', 'businessNumber', 'industry', 'employeeCount']
			const extractedRequiredFields = result.extractedFields.filter(f => requiredFields.includes(f))
			result.confidence = Math.round((extractedRequiredFields.length / requiredFields.length) * 100)

			return result
		} catch (error) {
			console.error('회사 정보 파싱 실패:', error)
			return result
		}
	}

	/**
	 * 회사명 추출
	 */
	private extractCompanyName(text: string): string | null {
		// 패턴: "회사명:", "상호:", "기업명:" 등 뒤에 오는 텍스트
		const patterns = [
			/(?:회사명|상호|기업명|법인명|회사이름)\s*[:：]\s*([^\n]+)/i,
			/(?:Company Name|Corporation)\s*[:：]\s*([^\n]+)/i,
			/^([가-힣A-Za-z0-9\s&()]+(?:주식회사|㈜|\(주\)|Inc\.|Corp\.|Co\.|Ltd\.))/m,
		]

		for (const pattern of patterns) {
			const match = text.match(pattern)
			if (match && match[1]) {
				return match[1].trim()
			}
		}

		return null
	}

	/**
	 * 사업자등록번호 추출
	 */
	private extractBusinessNumber(text: string): string | null {
		// 패턴: 123-45-67890 형식
		const patterns = [
			/(?:사업자등록번호|사업자번호|등록번호)\s*[:：]\s*(\d{3}-\d{2}-\d{5})/,
			/(\d{3}-\d{2}-\d{5})/,
			/(\d{10})/,
		]

		for (const pattern of patterns) {
			const match = text.match(pattern)
			if (match && match[1]) {
				const number = match[1].replace(/\D/g, '')
				if (number.length === 10) {
					return `${number.slice(0, 3)}-${number.slice(3, 5)}-${number.slice(5)}`
				}
			}
		}

		return null
	}

	/**
	 * 업종 추출 및 매핑
	 */
	private extractIndustry(text: string): string | null {
		const industryKeywords = {
			'IT/SaaS/Software': ['IT', 'SaaS', '소프트웨어', '정보통신', '인터넷', '웹', '앱', '플랫폼'],
			'Manufacturing/Production': ['제조', '생산', '공장', 'Manufacturing'],
			'Finance/Insurance/Securities': ['금융', '보험', '증권', '은행', 'Finance', 'Insurance'],
			'Distribution/Retail/Trading': ['유통', '도소매', '무역', '판매', 'Retail'],
			'Service/Consulting': ['서비스', '컨설팅', '상담', 'Consulting'],
			'Construction/Engineering': ['건설', '건축', '토목', '엔지니어링', 'Construction'],
			'Medical/Pharmaceutical/Bio': ['의료', '제약', '바이오', '병원', 'Medical', 'Pharma'],
			'Education/Research': ['교육', '연구', '학원', '대학', 'Education', 'Research'],
			'Media/Content/Entertainment': ['미디어', '콘텐츠', '엔터테인먼트', '방송', 'Media'],
			'Food/Beverage/Restaurant': ['식품', '음료', '외식', '레스토랑', 'Food', 'Beverage'],
			'Fashion/Beauty/Lifestyle': ['패션', '뷰티', '화장품', 'Fashion', 'Beauty'],
			'Logistics/Transportation': ['물류', '운송', '배송', 'Logistics', 'Transportation'],
			'Energy/Environment': ['에너지', '환경', 'Energy', 'Environment'],
			'Real Estate/Property': ['부동산', '건물', 'Real Estate', 'Property'],
			'Telecommunications': ['통신', '텔레콤', 'Telecom'],
			'Automotive/Mobility': ['자동차', '모빌리티', 'Automotive', 'Mobility'],
			'Marketing/Advertising/PR': ['마케팅', '광고', 'Marketing', 'Advertising'],
		}

		const lowerText = text.toLowerCase()

		for (const [industry, keywords] of Object.entries(industryKeywords)) {
			for (const keyword of keywords) {
				if (lowerText.includes(keyword.toLowerCase())) {
					return industry
				}
			}
		}

		return null
	}

	/**
	 * 직원 수 추출
	 */
	private extractEmployeeCount(text: string): string | number | null {
		// 패턴: "직원 수: 150명", "임직원: 200명" 등
		const exactPattern = /(?:직원|임직원|인원)\s*(?:수)?\s*[:：]?\s*(\d+)\s*명?/
		const match = text.match(exactPattern)
		
		if (match && match[1]) {
			const count = parseInt(match[1], 10)
			return count
		}

		// 범위 패턴
		const rangePatterns = [
			{ pattern: /10명?\s*이하|1~10명?/, value: '1-10' },
			{ pattern: /11~50명?|10~50명?/, value: '11-50' },
			{ pattern: /51~200명?|50~200명?/, value: '51-200' },
			{ pattern: /201~500명?|200~500명?/, value: '201-500' },
			{ pattern: /500명?\s*이상|500\+/, value: '500+' },
		]

		for (const { pattern, value } of rangePatterns) {
			if (pattern.test(text)) {
				return value
			}
		}

		return null
	}

	/**
	 * 주소 추출
	 */
	private extractAddress(text: string): string | null {
		const patterns = [
			/(?:주소|소재지|위치)\s*[:：]\s*([^\n]+(?:시|구|동|로|길)[^\n]{0,50})/,
			/([가-힣]+(?:시|도)\s+[가-힣]+(?:시|구)\s+[^\n]+)/,
		]

		for (const pattern of patterns) {
			const match = text.match(pattern)
			if (match && match[1]) {
				return match[1].trim()
			}
		}

		return null
	}

	/**
	 * 웹사이트 추출
	 */
	private extractWebsite(text: string): string | null {
		const pattern = /(?:웹사이트|홈페이지|URL|Website)\s*[:：]?\s*((?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?)/i
		const match = text.match(pattern)
		
		if (match && match[1]) {
			let url = match[1].trim()
			if (!url.startsWith('http')) {
				url = 'https://' + url
			}
			return url
		}

		// 단순 URL 패턴
		const simpleUrlPattern = /((?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,})/
		const simpleMatch = text.match(simpleUrlPattern)
		if (simpleMatch && simpleMatch[1]) {
			let url = simpleMatch[1].trim()
			if (!url.startsWith('http')) {
				url = 'https://' + url
			}
			return url
		}

		return null
	}

	/**
	 * 설립연도 추출
	 */
	private extractEstablishedYear(text: string): string | null {
		const patterns = [
			/(?:설립|창립|창업)\s*(?:년도|년|연도)?\s*[:：]?\s*(\d{4})\s*년?/,
			/(\d{4})\s*년\s*(?:설립|창립|창업)/,
		]

		for (const pattern of patterns) {
			const match = text.match(pattern)
			if (match && match[1]) {
				const year = parseInt(match[1], 10)
				const currentYear = new Date().getFullYear()
				if (year >= 1900 && year <= currentYear) {
					return match[1]
				}
			}
		}

		return null
	}

	/**
	 * 대표자명 추출
	 */
	private extractCEO(text: string): string | null {
		const patterns = [
			/(?:대표이사|대표자|대표|CEO)\s*[:：]\s*([가-힣A-Za-z\s]+)/,
			/(?:대표이사|CEO)\s+([가-힣A-Za-z]+)/,
		]

		for (const pattern of patterns) {
			const match = text.match(pattern)
			if (match && match[1]) {
				return match[1].trim()
			}
		}

		return null
	}

	/**
	 * 파일에서 회사 정보 추출 (원스텝)
	 */
	async parseCompanyDocument(file: File): Promise<ParsedCompanyInfo> {
		try {
			// 1. 텍스트 추출
			const text = await this.extractTextFromFile(file)
			
			// 2. 정보 파싱
			const parsedInfo = await this.parseCompanyInfo(text)
			
			return parsedInfo
		} catch (error) {
			console.error('문서 파싱 실패:', error)
			throw error
		}
	}
}

export const companyDocumentParser = new CompanyDocumentParserService()

