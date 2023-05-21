import { ComponentNode } from './ComponentNode'

let currentInstance: ComponentNode | null = null

export function getCurrentInstance() {
	return currentInstance
}

export function getCurrentInstanceOrThrow() {
	if (!currentInstance) throw new Error('No current instance')
	return currentInstance
}

export function setCurrentInstance(instance: ComponentNode | null) {
	currentInstance = instance
}

export function useNode(instance = getCurrentInstanceOrThrow()) {
	return instance
}
