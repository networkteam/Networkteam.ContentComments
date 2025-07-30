<?php
namespace Networkteam\ContentComments;

use Neos\Flow\Annotations as Flow;
use Neos\Neos\Service\DataSource\AbstractDataSource;
use Neos\ContentRepository\Domain\Model\NodeInterface;


class CommentingCurrentUserDataSource extends AbstractDataSource {


	static protected $identifier = 'commenting-current-user';

	/**
	 * @Flow\Inject
	 * @var \Neos\Neos\Service\UserService
	 */
	protected $userService;

	/**
  * Get data
  *
  * @param \Neos\ContentRepository\Core\Projection\ContentGraph\Node $node The node that is currently edited (optional)
  * @param array $arguments Additional arguments (key / value)
  * @return mixed JSON serializable data
  * @api
  */
 public function getData(\Neos\ContentRepository\Core\Projection\ContentGraph\Node $node = NULL, array $arguments = []) {
		return array('name' => $this->userService->getBackendUser()->getName()->getFullName());
	}
}
