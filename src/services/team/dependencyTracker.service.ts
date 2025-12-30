/**
 * Dependency Tracker Service
 * 부서 간 의존성 관리 및 병목 탐지
 */

import type { Project, Objective } from '../../types/common.types'
import { storage } from '../../utils/storage'

export type DependencyType = 'blocks' | 'enables' | 'supports'
export type DependencyStatus = 'on-track' | 'at-risk' | 'blocked'

export interface DepartmentDependency {
	fromDepartment: string
	toDepartment: string
	type: DependencyType
	relatedObjectives: {
		fromObjectiveId: string
		toObjectiveId: string
		criticality: 'critical' | 'important' | 'nice-to-have'
	}[]
	status: DependencyStatus
	bottlenecks?: {
		description: string
		impact: string
		suggestedResolution: string
	}[]
}

export class DependencyTrackerService {
	async analyzeDependencies(): Promise<DepartmentDependency[]> {
		const projects = storage.get<Project[]>('projects', [])
		const objectives = storage.get<Objective[]>('objectives', [])

		const dependencies: DepartmentDependency[] = []

		// 프로젝트 기반 의존성 분석
		for (const project of projects) {
			if (!project.departments || project.departments.length < 2) continue

			// 부서 간 협업이 필요한 프로젝트
			for (let i = 0; i < project.departments.length; i++) {
				for (let j = i + 1; j < project.departments.length; j++) {
					const dep = this.createDependency(
						project.departments[i],
						project.departments[j],
						project
					)
					if (dep) dependencies.push(dep)
				}
			}
		}

		return dependencies
	}

	private createDependency(
		from: string,
		to: string,
		project: Project
	): DepartmentDependency | null {
		const status: DependencyStatus = 
			project.progress < 50 ? 'at-risk' :
			project.status === 'on-hold' ? 'blocked' : 'on-track'

		return {
			fromDepartment: from,
			toDepartment: to,
			type: 'supports',
			relatedObjectives: [],
			status,
			bottlenecks: status !== 'on-track' ? [{
				description: `프로젝트 "${project.name}" 진척 저조`,
				impact: '타 부서 업무 지연 가능',
				suggestedResolution: '부서 간 조율 회의 실시',
			}] : undefined,
		}
	}

	async detectBottlenecks(): Promise<string[]> {
		const dependencies = await this.analyzeDependencies()
		const bottlenecks = new Set<string>()

		for (const dep of dependencies) {
			if (dep.status === 'blocked' || dep.status === 'at-risk') {
				bottlenecks.add(dep.fromDepartment)
			}
		}

		return Array.from(bottlenecks)
	}
}

export const dependencyTrackerService = new DependencyTrackerService()

